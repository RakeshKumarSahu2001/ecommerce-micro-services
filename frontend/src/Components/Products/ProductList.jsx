import { useEffect, useState } from "react";
import {
  ProductApi,
  ProductSlice,
} from "../../EcommerceStore/productsOpt/ProductApi";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { DeleteSpecificProductApi } from "../../EcommerceStore/productsOpt/DeleteSpecificProductById";
import ProductCard from "./ProductCard";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { FetchProductFilterPropsApi } from "../../EcommerceStore/productsOpt/FetchProductFilterPropsApi";
import { FetchProductByFilterApi } from "../../EcommerceStore/productsOpt/FetchProductByFilterApi";

export default function Product() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filterBrand, setFilterBrand] = useState([]);
  const [filterCategory, setFilterCategory] = useState([]);
  const [productList, setProductList] = useState(null);

  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.products.loadingStatus);
  const loadingError = useSelector((state) => state.products.loadingError);
  const navigate = useNavigate();

  const productFilters = useSelector(
    (state) => state.FetchProductFilterPropsSlice.productFilterProps
  );
  const brands = [...new Set(productFilters?.map((product) => product.brand))];
  const category = [
    ...new Set(productFilters?.map((product) => product?.category)),
  ];
  const filters = [
    {
      id: "Brand",
      name: "Brand",
      options: brands?.map((brand) => {
        return {
          label: brand,
          value: brand,
          checked: false,
        };
      }),
    },
    {
      id: "Category",
      name: "Category",
      options: category?.map((category) => {
        return {
          label: category,
          value: category,
          checked: false,
        };
      }),
    },
  ];

  const handleDeleteProduct = async (id) => {
    await dispatch(DeleteSpecificProductApi(id));
  };
  const loggedInUser=useSelector((state)=>state.loginSlice.loggedInUser);
  console.log("loggedInUser :",loggedInUser);
  const products = useSelector((state) => state.products.allProducts);

  useEffect(() => {
    dispatch(FetchProductFilterPropsApi());
    dispatch(ProductApi());
  }, [dispatch]);

  useEffect(() => {
    if (products?.length) {
      setProductList(products);
    }
  }, [products]);

  useEffect(() => {
    if (loadingError) {
      // navigate("/shopnow/error")
      // dispatch(ProductSlice.actions.setToInitValue())
    }
  }, [loadingError, navigate]);

  const handleFilterOnchange = (value, filterName) => {
    if (filterName === "Brand") {
      setFilterBrand((prev) => {
        return prev.includes(value) ? [...prev] : [...prev, value];
      });
    } else {
      setFilterCategory((prev) => {
        return prev.includes(value) ? [...prev] : [...prev, value];
      });
    }
  };

  const filteredProducts = useSelector(
    (state) => state.FetchProductByFilterSlice.allProducts
  );
  useEffect(() => {
    if (filterBrand.length>0 || filterCategory.length>0) {
      const debounce = setTimeout(() => {
        dispatch(
          FetchProductByFilterApi({
            Brand: filterBrand,
            Category: filterCategory,
          })
        );
        setProductList(filteredProducts);
      }, 3000);
      return () => clearTimeout(debounce);
    }
  }, [filterBrand, filterCategory, dispatch]);

  useEffect(() => {
    if (filteredProducts && filteredProducts.length) {
      setProductList(filteredProducts);
    }
  }, [filteredProducts]);

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Dialog
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          className="relative z-40 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>

              <form className="mt-4 border-t border-gray-200">
                <h3 className="sr-only">Categories</h3>
                {filters.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-t border-gray-200 px-4 py-6"
                  >
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">
                          {section.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="h-5 w-5 group-data-[open]:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="h-5 w-5 [.group:not([data-open])_&]:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-6">
                        {section?.options?.map((option, optionIdx) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              defaultValue={option.value}
                              defaultChecked={option.checked}
                              id={`filter-mobile-${section.id}-${optionIdx}`}
                              name={`${section.id}[]`}
                              type="checkbox"
                              onChange={() =>
                                handleFilterOnchange(option.value, section.name)
                              }
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                              htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                              className="ml-3 min-w-0 flex-1 text-gray-500"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="relative mx-auto max-w-[160rem] sm:px-6 lg:px-8 lg:py-20 ">
          <div className="flex items-center justify-center absolute w-16 h-16 z-30 top-[92%] left-[5%] lg:hidden bg-[#87a7db] rounded-full">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="flex justify-center items-center !w-32 hover:text-gray-500 lg:hidden"
            >
              <FunnelIcon aria-hidden="true" className="size-8 text-gray-600" />
            </button>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-7">
              {/* Filters */}
              <form className="hidden lg:block">
                <h3 className="sr-only">Categories</h3>
                {filters.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-b border-gray-200 py-6"
                  >
                    <h3 className="-my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">
                          {section.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="h-5 w-5 group-data-[open]:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="h-5 w-5 [.group:not([data-open])_&]:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-4">
                        {section?.options?.map((option, optionIdx) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              defaultValue={option.value}
                              defaultChecked={option.checked}
                              id={`filter-${section.id}-${optionIdx}`}
                              name={`${section.id}[]`}
                              type="checkbox"
                              onChange={() =>
                                handleFilterOnchange(option.value, section.name)
                              }
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                              htmlFor={`filter-${section.id}-${optionIdx}`}
                              className="ml-3 text-sm text-gray-600"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>

              {/* Product grid */}
              <div className="lg:col-span-6">
                <div className="bg-white">
                  <div className="mx-auto max-w-2xl md:px-4 md:py-4 sm:px-6 sm:py-2 lg:max-w-[120rem] lg:px-4">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                      Customers also purchased
                    </h2>

                    <div className="mt-6 grid grid-cols-2 md:gap-x-6 md:gap-y-8 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                      {/* product mapped here */}
                      {isLoading ? (
                        <div className="!w-[100vw] flex justify-center items-center">
                          <span className="loading loading-dots loading-lg"></span>
                        </div>
                      ) : (
                        productList?.map((product) => (
                          <Link
                            to={`/shopnow/productDetail/${product?.id}`}
                            key={product?.id}
                          >
                            <ProductCard
                              ProductID={product?.id}
                              ProductName={String(product?.productName)}
                              ThumbnailImage={product?.thumbnailImage}
                              Rating={Number(product?.rating)}
                              Price={Number(product?.price)}
                              Discount={Number(product?.discount)}
                              handleDeleteProduct={handleDeleteProduct}
                            />
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
