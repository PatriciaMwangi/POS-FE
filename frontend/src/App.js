import './App.css';
import Product from './components/addSale'
import SignUpForm from './components/Auth/register';
import LandingPage from './components/landingPage/landingpage';
import SignIn from './components/Auth/signIn';
import Admin from './components/admin/adminDashBoard/adminDashboard';
import Supplier from './components/admin/+purchases/addsupplier';
import { CreditSaleProduct } from './components/admin/saleButton/creditsaleProducts';
import CustomersCreditProduct from './components/admin/customerButton/customercreditproducts';
import AddPurchaseDetails from './components/admin/+purchases/addpurchasedetails'
import Purchases from './components/admin/purchases/purchases'
import User from './components/user/userDashboard'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {PurchaseDetails} from './components/admin/purchases/purchasedetails';
import SupplierDetails from './components/admin/supplierdetails';
import ProductDetails from './components/admin/productdetails';
import AddCustomers from './components/admin/+sales/addcustomer';
import Price from './components/admin/+sales/price';
import { EditPurchaseDetails } from './components/admin/purchases/updatepurchasedetails';
import SalesNewProduct from './components/admin/+sales/salesnewproduct';
import AddCashSaleDetails from './components/admin/+sales/cashsaledetails';
import Customers from './components/admin/customerButton/customers';
import CustomersProduct from './components/admin/customerButton/customerscashproducct';
import Suppliers from './components/admin/supplierButton/suppliers';
import SupplierProduct from './components/admin/supplierButton/supplier_product';
import { SupplierPurchaseDetails } from './components/admin/supplierButton/supplier_purchasedetails';
import SellingPrice from './components/admin/setSelllingPriceButton/selling_price';
import fetchingCashSales from './components/admin/saleButton/fetchingCashSales';
import Cashsale from './components/admin/customerButton/saledetails';
import AddCreditSaleDetails from './components/admin/+sales/creditsaledetails';
import FetchingCashSales from './components/admin/saleButton/fetchingCashSales';
import FetchingCreditSales from './components/admin/saleButton/fetchingCreditSales';
import Products from './components/admin/adminDashBoard/productsButton/products';
import ProductSupplierDetails from './components/admin/adminDashBoard/productsButton/productsupplierdetails';
import Bin from './components/admin/adminDashBoard/Bin';
//import SuppliedProducts from './components/admin/adminDashBoard/productsButton/supplierproducts';
//import { fetchedSuppliedProducts } from './components/admin/redux/fetchSuppliers';
import ProductPurchaseDetails from './components/admin/adminDashBoard/productsButton/productspurchasedetails';
import AddSupplier from './components/admin/+purchases/addsupplier';

 function App() {
  return (
   <>
   <BrowserRouter>
   <Routes>
    <Route path = '/creditsale-products' element = {<CreditSaleProduct/>}/>
    <Route path ='/products' element = {<Products/>}/>
   <Route path = '/' element ={<LandingPage/>}/>
   <Route path = '/admin-dashboard' element ={<Admin/>}/>
   <Route path = '/register' element ={<SignUpForm/>}/>
   <Route path = '/products' element = {<Product/>}/>
   <Route path = '/sign-in' element = {<SignIn/>}/>
   <Route path = '/user-dashboard' element ={<User/>}/>
   <Route path = '/new-supplier' element = {<AddSupplier/>}/>
   <Route path = '/new-purchasedetails' element = {<AddPurchaseDetails/>}/>
   <Route path = '/deleted-products' element = {<Bin/>}/>
   <Route path = '/purchases' element = {<Purchases/>}/>
   <Route path = '/purchase-details/:purchaseid' element={<PurchaseDetails/>} />
   <Route path = '/supplierdetails/:purchaseid' element={<SupplierDetails/>} />
   <Route path = '/productdetails/:purchaseid' element={<ProductDetails/>} />
   <Route path = '/new-customer/' element={<AddCustomers/>} />
   <Route path = '/edit-purchase/:purchaseid' element = {<EditPurchaseDetails/>}/>
   <Route path = '/new-price' element = {<Price/>}/>
   <Route path = '/cashsale-product' element = {<SalesNewProduct/>}/>
   <Route path = '/add-cash-details' element = {<AddCashSaleDetails/>}/>
   <Route path = 'creditsale-product' element = {<AddCreditSaleDetails/>}/>
   <Route path = '/customers' element = {<Customers/>}/>
   <Route path = '/customer-product-details/:customerId' element= {<CustomersProduct/>}/>
   <Route path = '/suppliers' element = {<Suppliers/>}/>
   <Route path = 'customer-cash-products' element = {<CustomersProduct/>}/>
   <Route path = 'customer-credit-products' element = {<CustomersCreditProduct/>}/>
   <Route path = '/supplier-products/:supplierId' element = {<SupplierProduct/>}/>
   <Route path = 'supplier_purchasedetails/:productId' element = {<SupplierPurchaseDetails/>}/>
   <Route path = 'selling_price' element ={<SellingPrice/>}/>
   <Route path = '/cashsales' element ={<FetchingCashSales/>}/>
   <Route path = '/creditsales' element = {<FetchingCreditSales/>}/>
   <Route path = '/cashsale' element = {<Cashsale/>}/>
   <Route path = '/product-supplier-details/:purchaseId' element={<ProductSupplierDetails/>}/>
   <Route path ='/product-purchase-details/:purchaseId' element={<ProductPurchaseDetails/>}/>
   </Routes>
   </BrowserRouter>
   </>
  );
}

export default App;
