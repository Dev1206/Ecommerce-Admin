import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";

export default function newProduct(){
    return (
        <Layout>
            <h1>New Product</h1>
            <ProductForm />
        </Layout>
    );
}