import './Cart.css'
import { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import { CartItem } from "./CartItem";
import { Link } from 'react-router-dom';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../FireBase';
import { Alert } from 'react-bootstrap';

export const Cart = () => {
    const carritoContext = useContext(CartContext);
    const productosCarrito = carritoContext.productosCarrito;
    const eliminar = carritoContext.clear
    const [show, setShow] = useState(true);

    const sendOrder = async(e) => {
        e.preventDefault();
        const nombre = e.target[0].value;
        const telefono = e.target[1].value;
        const gmail = e.target[2].value;

        const newOrder = {
            buyer:{
                name: nombre,
                phone: telefono,
                email: gmail
            },
            items: productosCarrito,
            total: carritoContext.getTotalPrice(),
            date: Timestamp.fromDate(new Date())
        }
        
        const ordersCollection = collection(db, 'Orders');
        const docReference = await addDoc(ordersCollection, newOrder);
        alert(`Orden Enviada, id: ${docReference.id}`);
        eliminar()
    }
        
    return(
        <>
        <div>
             {
                productosCarrito.length>0 ?
                <>
                    {
                        productosCarrito.map(producto=>(
                            <CartItem key={producto.item.id} productoProp={producto}/>
                        ))
                    }
                    <div className='botones'>
                    <p className="totalprice">Total: ${carritoContext.getTotalPrice()}</p>
                        
                    </div>
                  
                        <div className='formulario'>
                            <form className='form' onSubmit={sendOrder}>
                                <input className="form-control" type="text" placeholder='Nombre' required/>
                                <input className="form-control" type="text" placeholder='Teléfono' required/>
                                <input className="form-control" type="gmail" placeholder='example@gmail.com' required/>
                                <button className='btn btn-primary enviar' type='submit' >Enviar orden</button>
                            </form>
                        </div>
                
                    <div className='botones'>
                        <button  className="btn btn-primary borrar" onClick={carritoContext.clear}>Vaciar carrito</button>
                    </div>
                </>
                :
                <div className='no'>
                    <div className='div'>
                        <p className="p">No hay productos</p>
                    </div>
                    <div className='div'>
                        <Link to="/">
                            <button className='btn btn-primary'>Volver a Inicio</button>
                        </Link>
                    </div>
                </div>
            }
        </div>
        </>
    )
}