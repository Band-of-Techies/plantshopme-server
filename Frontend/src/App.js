import Home from "./pages/home/Home";
import Login from "./components/Login"
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import Main from "./components/Main";
import Signup from "./components/Singup";
import AddCategory from "./components/Category/AddCategory";
import Addplantcare from "./components/Plant Care/Plantcare";
import ProductAdd from "./components/ProductAdd/ProductAdd";
import Demo from "./components/ProductAdd/Demo";
import Pot from "./components/Pot/Pot";
import Stock from "./components/Stock/Stock"
import PaymentIntentsTable from "./components/OrderDetails/OrderDetails";
import FlashSale from "./components/FlashSales/FlashSale";
import FlashSalesData from "./components/FlashSales/FlashSalesData";
import Updateproduct from "./components/ProductAdd/ProductsUpdation/updateProduct"
import Blog from "./components/Blog/Blog";
import AllBlogs from "./components/Blog/AllBlogs";
import SingleBlog from "./components/Blog/SingleBlog";
import EditBlog from "./components/Blog/EditBlog";
import OfferBanner from "./components/OfferBanners/OfferBanner";
import Allproducts from "./components/Allproducts/Allproducts";
import ProductImageUpdation from "./components/ProductAdd/ProductsUpdation/ProductImageUpdation";
import AddCoupons from "./components/Coupons/AddCoupons";
import ViewCoupons from "./components/Coupons/viewCouponDetails";
import UpdateCoupons from "./components/Coupons/UpdateCoupons";
import OtherProducts from "./components/Allproducts/OtherProducts/OtherProducts";
import Locations from "./components/locations/Locations";
import Newsletter from "./components/NewsLetter/Newsletter";
import CustomerOrder from "./components/OrderDetails/CustomerOrder";
import RefundForm from "./components/RefundForm/RefundForm";
import AddNewproduct from "./components/NewAddProduct/AddNewproduct";
import Mapfunction from "./components/Map/Mapfunction";
import Refundlist from "./components/RefundForm/Refundlist";
import Rolemanagement from "./components/RoleManagement/Rolemanagement";
import Featurelevel from "./components/FeatureLevel/Featurelevel";
import CouponManagement from "./components/Coupons/CouponManagement";
import UpdateProductCategories from "./components/UpdateProductCategories/UpdateProductCategories";
import User from "./components/Coupons/User";
import Sidebar from "./components/sidebar/Sidebar";

function App() {
  const { darkMode } = useContext(DarkModeContext);
  const user = localStorage.getItem("token");
  const UserType = localStorage.getItem("UserType");

 
  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          {user && <Route path="/" exact element={<Home />} />}

          <Route path="login" element={<Login />} />
          <Route path="/" element={<Navigate replace to="/login" />} />

          {user && <Route path="/CouponManagement" exact element={<CouponManagement />} />}
          <Route path="/CouponManagement" element={<Navigate replace to="/login" />} />

          {user && <Route path="/Rolemanagement" exact element={<Rolemanagement />} />}
          <Route path="/Rolemanagement" element={<Navigate replace to="/login" />} />

          {user && <Route path="/CouponManagement/:id" exact element={<User/>} />}
          <Route path="/CouponManagement/:id" element={<Navigate replace to="/login" />} />

          {user && <Route path="/FeatureLevel" exact element={<Featurelevel />} />}
          <Route path="/FeatureLevel" element={<Navigate replace to="/login" />} />

          {user && <Route path="/signup" exact element={<Signup />} />}
          <Route path="/signup" element={<Navigate replace to="/login" />} />

          {user && <Route path="/UpdateProductCategories" exact element={<UpdateProductCategories />} />}
          <Route path="/UpdateProductCategories" element={<Navigate replace to="/login" />} />

          {user && <Route path="/addCategory" element={<AddCategory />} />}
          <Route path="/addCategory" element={<Navigate replace to="/login" />} />

          {user && <Route path="/addplantcare" element={<Addplantcare />} />}
          <Route path="/addplantcare" element={<Navigate replace to="/login" />} />

          {user && <Route path="/addAddProduct" element={<ProductAdd />} />}
          <Route path="/addAddProduct" element={<Navigate replace to="/login" />} />

          {user && <Route path="/adddemo" element={<Demo />} />}
          <Route path="/adddemo" element={<Navigate replace to="/login" />} />

          {user && <Route path="/addPot" element={<Pot />} />}
          <Route path="/addPot" element={<Navigate replace to="/login" />} />

          {user && <Route path="/update-product/:_Id/:title" element={<Updateproduct></Updateproduct>}/>}
          <Route path="/update-product/:_id/:title" element={<Navigate replace to="/login" />} />

          {user && <Route path="/productstock" element={<Stock />} />}
          <Route path="/productstock" element={<Navigate replace to="/login" />} />

          {user && <Route path="/orderdetails" element={<PaymentIntentsTable />} />}
          <Route path="/orderdetails" element={<Navigate replace to="/login" />} />

          {user && <Route path="/FlashSale" element={<FlashSale />}></Route>}
          <Route path="/FlashSale" element={<Navigate replace to="/login" />} />

          {user && <Route path="/product-details" element={<FlashSalesData />}></Route>}
          <Route path="/product-details" element={<Navigate replace to="/login" />} />

          {user && <Route path="/locations" element={<Locations />}></Route>}
          <Route path="/locations" element={<Navigate replace to="/login" />} />

          {user && <Route path="/all-products" element={<Allproducts />}></Route>}
          <Route path="/all-products" element={<Navigate replace to="/login" />} />


          {user && <Route path="/addBlog" element={<Blog />}></Route>}
          <Route path="/addBlog" element={<Navigate replace to="/login" />} />

          {user && <Route path="/blogs" element={<AllBlogs />}></Route>}
          <Route path="/blogs" element={<Navigate replace to="/login" />} />

          {user && <Route path="/blogs/post/:id" element={<SingleBlog />}></Route>}
          <Route path="/blog/post/:id" element={<Navigate replace to="/login" />} />

          {user && <Route path="/blogs/edit-post/:id" element={<EditBlog />}></Route>}
          <Route path="/blogs/edit-post/:id" element={<Navigate replace to="/login" />} />

          {user && <Route path="/offerBanners" element={<OfferBanner />}></Route>}
          <Route path="/offerBanners" element={<Navigate replace to="/login" />} />

          {user && <Route path="/Addcoupons" element={<AddCoupons />}></Route>}
          <Route path="/Addcoupons" element={<Navigate replace to="/login" />} />

          {user && <Route path="/viewCoupons" element={<ViewCoupons />}></Route>}
          <Route path="/viewCoupons" element={<Navigate replace to="/login" />} />
          {user && <Route path="/otherproducts" element={<OtherProducts />}></Route>}
          <Route path="/otherproducts" element={<Navigate replace to="/login" />} />

          {user && <Route path="/UpdateCoupons/:id" element={<UpdateCoupons />}></Route>}
          <Route path="/UpdateCoupons/:id" element={<Navigate replace to="/login" />} />

          {user && <Route path="/newsletter" element={<Newsletter />}></Route>}
          <Route path="/newsletter" element={<Navigate replace to="/login" />} />
          
          {user && <Route path="/ordercustomerdetails/:id" element={<CustomerOrder />}></Route>}
          <Route path="/ordercustomerdetails/:id" element={<Navigate replace to="/login" />} />

          {user && <Route path="/Addnewproduct" element={<AddNewproduct />}></Route>}
          <Route path="/Addnewproduct" element={<Navigate replace to="/login" />} />

          {user && <Route path="/Mapdirection" element={<Mapfunction />}></Route>}
          <Route path="/Mapdirection" element={<Navigate replace to="/login" />} />

          {user && <Route path="/Refundlist" element={<Refundlist />}></Route>}
          <Route path="/Refundlist" element={<Navigate replace to="/login" />} />

          {user && <Route path="/refundform/:id" element={<RefundForm />}></Route>}
          <Route path="/refundform/:id" element={<Navigate replace to="/login" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
