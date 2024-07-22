import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect,useState } from "react";


export default function DeleteProductPage(){
    const router = useRouter();
    const [productInfo, setproductInfo] = useState();
    const {id} = router.query;

    useEffect(() => {
        if(!id){
            return;
        }
        axios.get('/api/products?id=' + id).then(response => {
            setproductInfo(response.data);
        });
        
    }, [id])

    function goBack() {
        router.push('/products');
    }

    async function deleteProduct() {
        await axios.delete('/api/products?id=' + id);
        goBack();
    }
    return(
        <Layout>
            <h1 className="text-center">Do you really want to delete &quot;{productInfo?.title}&quot;?</h1>
            <div className="flex gap-3 justify-center">

                <button onClick= {deleteProduct} className = "btn-red">
                    Yes
                </button>

                <button onClick={goBack} className = "btn-default" >
                    No
                </button>
                
            </div>
        </Layout>
    ); 
}
