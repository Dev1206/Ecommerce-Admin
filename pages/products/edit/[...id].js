import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect , useState } from "react";
import ProductForm from "@/components/ProductForm";

export default function editProductPage(){

    const [productInfo , setproductInfo] = useState(null);
    const router = useRouter();
    const {id} = router.query;

    useEffect(()=>{
        if (!id) {
            return;
        }
        axios.get('/api/products?id=' + id).then(response => {
            setproductInfo(response.data);
        });
    },[id]);
    
    return(
        <Layout>
            <h1>Edit Product</h1>
            {productInfo && (
                <ProductForm {...productInfo}/>
            )}
        </Layout>
    );
}