import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./Pages/HomePage";
import AuthPage from "./Pages/AuthPage";
import LoginPage from "./Pages/AuthPages/LoginPage";
import SignUpPage from "./Pages/AuthPages/SignUpPage";
import EmailValidationPage from "./Pages/AuthPages/EmailValidationPage";
import EmailPage from "./Pages/AuthPages/EmailPage";
import ResetPasswordPage from "./Pages/AuthPages/ResetPasswordPage";
import HomeCarousel from "./Components/Home/HomeCarousel";
import ProductsPage from "./Pages/Products/ProductsPage";
import ErrorPage from "./Pages/ErrorPage";
import ProductDetailsPage from "./Pages/Products/ProductDetailsPage";
import UserInfoPage from "./Pages/User/UserInfoPage";
import UserProfEdit from "./Pages/User/UserProfEdit";
import CartPage from "./Pages/Cart/CartPage";
import AddNewProductPage from "./Pages/Admin/AddNewProductPage";
import EditProductPage from "./Pages/Admin/EditProductPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}>
        <Route index element={<HomeCarousel />} />
        <Route path="shopnow/allproduct" element={<ProductsPage />} />
        {/* <Route path="shopnow/error" element={<ErrorPage />} /> */}
        <Route path="shopnow/productDetail/:id" element={<ProductDetailsPage />} />
        <Route path="shopnow/user-info/:id" element={<UserInfoPage />} />
        <Route path="shopnow/edit-user-profile/:id" element={<UserProfEdit />} />
        <Route path="shopnow/cart/:id" element={<CartPage />} />
        <Route path="shopnow/admin/add-product" element={<AddNewProductPage />} />
        <Route path="shopnow/admin/edit-product/:id" element={<EditProductPage />} />
      </Route>

      <Route path="/auth" element={<AuthPage />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="validate-email" element={<EmailValidationPage />} />
        <Route path="check-email-valid" element={<EmailPage />} />
        <Route path="reset-password/:email" element={<ResetPasswordPage />} />
      </Route>
    </Routes>
  );
}

export default App;
