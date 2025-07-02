import { Link } from "react-router-dom"
import { useSelector, useDispatch  } from "react-redux";
import { useMemo } from "react";
import CartCard from "./Cart/CartCard";
import { deleteCartProductApi } from "../EcommerceStore/cartOpt/DeleteCartProduct";
import { useraddToCartSlice } from "../EcommerceStore/cartOpt/FetchUserCartProducts";


function Cart({ handleMoveToProducts }) {
    const cartProducts = useSelector((state) => state.userCartProducts.cartProducts);

    const dispatch = useDispatch()
    const id = sessionStorage.getItem("Id");

    const subTotal = useMemo(() => {
        return cartProducts?.reduce((total, product) => {
            return total + Math.round(parseInt(product.Price) * product.Quantity * (1 - parseInt(product.Discount) / 100))
        }, 0);
    }, [cartProducts])

    const handleDeleteProductFromCart = (CartID) => {
        dispatch(deleteCartProductApi(CartID))
    }

    const handleIncQuantity = (CartID) => {
        dispatch(useraddToCartSlice.actions.incQuantity(CartID))
    }
    const handleDecQuantity = (CartID) => {
        dispatch(useraddToCartSlice.actions.decQuantity(CartID))
    }
    return (
        <>
            <div className='mx-auto max-w-7xl relative !h-[100%]'>
                {Number(cartProducts[0]?.items?.length) > 0 ?
                    (<>
                        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                            <div className="flow-root">
                                <ul role="list" className="-my-6 divide-y divide-gray-200">
                                    {cartProducts[0]?.items && cartProducts[0]?.items?.map((product) =>
                                        <li key={product.id}>

                                            <CartCard
                                                ProductName={product?.product?.name}
                                                ThumbnailImage={product?.product?.thumbnailImage}
                                                Price={Number(product?.product?.price)}
                                                CartID={product?.product?.cartID}
                                                Discount={product.Discount}
                                                Quantity={product?.unit}
                                                handleDeleteProductFromCart={handleDeleteProductFromCart}
                                                handleIncQuantity={handleIncQuantity}
                                                handleDecQuantity={handleDecQuantity}
                                            />
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-6 sm:px-6 absolute bottom-0 left-0 right-0">
                            <div className="flex justify-between text-base font-medium text-gray-900">
                                <p>Subtotal</p>
                                <p>
                                    ₹{subTotal}
                                </p>
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">
                                Shipping and taxes calculated at checkout.
                            </p>
                            <div className="mt-6">
                                <Link
                                    to={`/shopnow/cart/${id}`}
                                    className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                                >
                                    Checkout
                                </Link>
                            </div>
                            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                <p>
                                    or{" "}
                                    <button
                                        type="button"
                                        onClick={() => handleMoveToProducts()}
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                        Continue Shopping
                                        <span aria-hidden="true"> &rarr;</span>
                                    </button>
                                </p>
                            </div>
                        </div>
                    </>)
                    : <div className="flex flex-col justify-center items-center !h-[100%]">
                        <h3>Cart is empty.</h3>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                            <p>
                                <button
                                    type="button"
                                    onClick={() => handleMoveToProducts()}
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    Continue Shopping
                                    <span aria-hidden="true"> &rarr;</span>
                                </button>
                            </p>
                        </div>
                    </div>}
            </div>
        </>
    )
}

export default Cart