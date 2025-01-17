use proc_macro::TokenStream;
use quote::quote;
use syn::{
    parse_macro_input, AngleBracketedGenericArguments, Attribute, Data, DeriveInput, Expr, ExprLit,
    Fields, GenericArgument, Ident, Lit, Meta, MetaNameValue, Path, PathArguments, Type, TypePath,
};

#[proc_macro_derive(Entity, attributes(collection_name))]
pub fn insertable(input: TokenStream) -> TokenStream {
    let ast = parse_macro_input!(input as DeriveInput);

    let mut collection_name: Option<String> = None;
    for attr in ast.attrs.clone().into_iter() {
        if let Attribute {
            meta:
                Meta::NameValue(MetaNameValue {
                    value:
                        Expr::Lit(ExprLit {
                            lit: Lit::Str(lit), ..
                        }),
                    ..
                }),
            ..
        } = attr
        {
            collection_name = Some(lit.value())
        }
    }

    let ident: Ident;
    let fields: Fields;

    if let DeriveInput {
        data: Data::Struct(ds),
        ..
    } = ast
    {
        ident = ast.ident;
        fields = ds.fields;
    } else {
        panic!("Entity can only be derived for structs");
    }

    // This code tests that the struct we are dering for
    // has an id field with a type of Option<u32>
    let mut has_id: bool = false;
    let mut id_field_ident = None;
    for field in fields.into_iter() {
        if field.ident.clone().unwrap().to_string() == "_id"
            || field.ident.clone().unwrap().to_string() == "id"
        {
            if let Type::Path(TypePath {
                path: Path { segments, .. },
                ..
            }) = field.ty
            {
                let last_segment = segments.last().unwrap();
                if last_segment.ident.to_string() == "Option" {
                    if let PathArguments::AngleBracketed(AngleBracketedGenericArguments {
                        args,
                        ..
                    }) = last_segment.clone().arguments
                    {
                        if let GenericArgument::Type(Type::Path(TypePath {
                            path: Path { segments, .. },
                            ..
                        })) = args.first().unwrap()
                        {
                            let last_segment = segments.last().unwrap().ident.to_string();
                            has_id = last_segment == "ObjectId" || last_segment == "u32";
                            id_field_ident = field.ident;
                        }
                    }
                }
            }
        }
    }

    if !has_id {
        panic!("All entities must have an id field with type Option<u32>");
    }

    if collection_name.is_none() {
        collection_name = Some(ident.to_string());
    }

    let collection_name = collection_name.unwrap();

    let insert = quote! {
        async fn insert(&self, db: &mongodb::Database) -> std::result::Result<mongodb::results::InsertOneResult, mongodb::error::Error> {
            db.collection::<#ident>(#collection_name).insert_one(self, None).await
        }
    };

    let delete = quote! {
        async fn delete(self, db: &mongodb::Database) -> std::result::Result<mongodb::results::DeleteResult, mongodb::error::Error> {
            db.collection::<#ident>(#collection_name).delete_one(bson::to_document(&self).unwrap(), None).await
        }
    };

    let query = quote! {
        async fn query(
            filter: bson::document::Document,
            db: &mongodb::Database
        ) -> std::result::Result<mongodb::Cursor<Self>, mongodb::error::Error> {
            db.collection::<#ident>(#collection_name).find(filter, None).await
        }
    };

    let find = quote! {
        async fn find(
            filter: bson::document::Document,
            db: &mongodb::Database,
            options: std::option::Option<mongodb::options::FindOptions>
        ) -> std::result::Result<std::vec::Vec<Box<Self>>, mongodb::error::Error> {
            let mut cursor = db.collection::<#ident>(#collection_name).find(filter, options).await?;
            let mut result = Vec::new();
            while cursor.advance().await? {
                result.push(std::boxed::Box::new(cursor.deserialize_current()?));
            }
            Ok(result)
        }
    };

    let find_one = quote! {
        async fn find_one(
            filter: bson::document::Document,
            db: &mongodb::Database,
            options: std::option::Option<mongodb::options::FindOptions>
        ) -> std::option::Option<std::boxed::Box<Self>> {
            let mut cursor = db.collection::<#ident>(#collection_name).find(filter, options).await.ok()?;
            cursor.advance().await.ok()?;
            cursor.deserialize_current().ok().map(|x| std::boxed::Box::new(x))
        }
    };

    let update = quote! {
        async fn update(
            &mut self,
            update: mongodb::options::UpdateModifications,
            db: &mongodb::Database
        ) -> std::result::Result<mongodb::results::UpdateResult, mongodb::error::Error> {
            let doc = mongodb::bson::doc! {
                "_id": self.#id_field_ident.unwrap()
            };
            db.collection::<#ident>(#collection_name).update_one(doc, update, None).await
        }
    };

    quote! {
        #[async_trait::async_trait]
       impl Entity for #ident {
            #insert
            #delete
            #query
            #update
            #find
            #find_one
        }
    }
    .into()
}
