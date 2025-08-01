import IsAdmin from './isAdmin';


function AdminOnly({ children }) {
    const isAdminObj = new IsAdmin();
    
    return isAdminObj.access ? <>{children}</> : <div>Admin Only</div>;
}

export default AdminOnly;
