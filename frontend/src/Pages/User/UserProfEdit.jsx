;
import { EditUserProfInfoById } from "../../EcommerceStore/userProf/AddEditUserProfInfoApi";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import UserProfForm from "../../Components/User/UserProfForm";



function UserProfEdit() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const navigate=useNavigate()

    if (!id) {
        console.error("User ID is missing from the route parameters.");
        return <div>Error: User ID is required</div>;
    }

    const onSubmit = (formData) => {
        dispatch(EditUserProfInfoById({ data: formData}));
        navigate(`/shopnow/user-info/${id}`)
    };

    return (
        <div>
            <UserProfForm submit={onSubmit} />
        </div>
    );
}

export default UserProfEdit;
