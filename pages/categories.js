import Layout from "@/components/Layout";
import { useState } from "react";
import axios from 'axios';
import { useEffect } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({swal}){

    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState('');
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        fetchCategories();
    },[]);

    function fetchCategories(){
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        });
    }

    async function saveCategory(ev){
        ev.preventDefault();
        const data = {
            name,
            parentCategory,
            properties:properties.map(p => ({
                name:p.name,
                values:p.values.split(','),
            })),
        };
        
        if(editedCategory){
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null);
        }
        else{
            await axios.post('/api/categories', data);
        }
        setParentCategory('');
        setName('');
        setProperties([]);

        fetchCategories();
    }

    function editCategory(category){
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(
            category.properties.map(({name,values}) => ({
                name,
                values:values.join(','),
            }))
        );

    }

    function deleteCategory(category){
        swal.fire({
            title: 'Are you sure',
            text: `you want to delete ${category.name}`,
            showCancelButton: true,
            canceButtonText: 'Cancel',
            confirmButtonText: 'Delete',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            if(result.isConfirmed){
                const {_id} = category;
                await axios.delete('/api/categories?_id=' + _id);
                fetchCategories();
            }
        });
    }

    function addProperty(){
        setProperties(prev => {
            return [...prev, {name:'', values:''}]
        });
    }

    function handelPropertyNameChange(index, property,newName){
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        });
    }

    function handelPropertyValuesChange(index, property,newValues){
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        });
    }

    function removeProperty(indexToRemove){
        setProperties(prev => {
            return [...prev].filter((p,pIndex) => {
                return pIndex !== indexToRemove;
            });
        });
    }

    return(
        <Layout>
            <h1>Categories</h1>
            
            <label>{editedCategory ? `Edit Category ${editedCategory.name}` : 'Create new category' }</label>
            <form onSubmit ={saveCategory} >
                <div className = "flex gap-1">
                <input className="" type="text" placeholder={'Category name'} onChange={ev => setName(ev.target.value)} value={name}/>
                
                <select className="" onChange={ev => setParentCategory(ev.target.value)} value={parentCategory}>
                    <option value=''>No parent category</option>
                    
                    {categories.length > 0 && categories.map(category =>(
                        <option key={category._id} value={category._id}>
                            {category.name}
                        </option>
                    ))}
                </select>

                </div>

                <div className="mb-4">
                    <label className="block">Properties</label>
                    <button type="button" onClick={addProperty} className="btn-default text-sm mb-2"> Add new Property </button>

                    {properties.length > 0  && properties.map((property,index) => (
                        <div key={index} className="flex gap-1 mb-2">
                            <input type="text" value={property.name} onChange={ev => handelPropertyNameChange(index,property,ev.target.value)} placeholder="Property name (example:color)" className="mb-0"/>
                            <input type="text" value={property.values} onChange={ev => handelPropertyValuesChange(index,property,ev.target.value)} placeholder="values, comma seperated" className="mb-0"/>
                            <button type="button" onClick={() => removeProperty(index)} className="btn-red">Remove</button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-1">

                    {editedCategory && (
                        <button type="button" 
                        className="btn-default" 
                        onClick = {() => {setEditedCategory(null); setName(''); setParentCategory(''); setProperties([]); }} >Cancel</button>
                    )}

                    <button type="submit" className="btn-primary py-1">Save</button>
                
                </div>
            </form>
            
            {!editedCategory && (

                <table className="basic mt-4">
                    <thead>
                        <tr>
                            <td>Category Name</td>
                            <td>Parent Category</td>
                            <td></td>
                        </tr>
                    </thead>

                    <tbody>
                    {categories.length > 0 && categories.map(category =>(
                        <tr key={category._id}>
                            <td>{category.name}</td>
                            <td>{category?.parent?.name}</td>
                            <td className="flex gap-1">
                                <button onClick={() => editCategory(category)} className="btn-default mr-1 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-6 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>
                                    Edit</button>
                                <button onClick={() => deleteCategory(category)}className="btn-red flex">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-6 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>    
                                    Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

            )}

        </Layout>
    );
}

export default withSwal(({swal}, ref) => (
    <Categories swal={swal} />
));
