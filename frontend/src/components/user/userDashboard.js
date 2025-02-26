import {Link} from 'react-router-dom'
import Navbar from '../admin/adminDashBoard/navBar'
const User = () =>{
    return(
      
        <>
        <Navbar/>
        <div class="d-grid gap-2 col-6 mx-auto">
  <button class="btn btn-outline-primary" type="button">Sales</button>
  <button class="btn btn-outline-secondary" type="button">Button</button>
</div>
<div class="d-grid gap-2 col-6 mx-auto">
  <button class="btn btn-outline-warning" type="button">Button</button>
  <button class="btn btn-outline-danger" type="button">Button</button>
</div>
<div class="d-grid gap-2 col-6 mx-auto">
  <button class="btn btn-outline-success" type="button">Button</button>
  <button class="btn btn-outline-info" type="button">Button</button>
</div>
        </>
    )
}
export default User