import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfInfoById } from "../../EcommerceStore/userProf/FetchUserProfInfoApi";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AddUserProfInfoById } from "../../EcommerceStore/userProf/AddEditUserProfInfoApi";
import UserProfForm from "./UserProfForm";

function UserInfo() {
  const id = useParams().id || "";
  const userInfo = useSelector(
    (state) => state.FetchUserProfInfoSlice.userProfileInfo
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isProfData = useSelector(
    (state) => state.manageUserProfInfoSlice.isProfData
  );

  const submit = async (formData) => {
    await dispatch(AddUserProfInfoById({ data: formData }));
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchUserProfInfoById(id));
    }
  }, [id, isProfData]);

  const handleRouteToNextPage = () => {
    navigate(`/shopnow/edit-user-profile/${userInfo?.id}`);
  };

  return userInfo ? (
    <div className="h-[100vh] flex justify-center items-center">
      <div className=" grid place-content-center">
        <div className="user-info-card grid grid-cols-1 md:grid-cols-2 md:grid-rows-5 grid-rows-9 gap-2 rounded-md shadow-[6px_10px_8px_12px_rgba(0,_0,_0,_0.1)] px-10 py-5">
          <div>
            <label htmlFor="FullName">Full name</label>
            <br />
            <p className="pr-5 pt-2 border-solid border-b-4 capitalize border-blue-600 hover:border-blue-700 overflow-hidden">
              {userInfo?.name}
            </p>
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <br />
            <p className="pr-5 pt-2 border-solid border-b-4 capitalize border-blue-600 hover:border-blue-700 overflow-hidden">
              {userInfo?.email}
            </p>
          </div>
          <div>
            <label htmlFor="Phone">Phone</label>
            <br />
            <p className="pr-5 pt-2 border-solid border-b-4 capitalize border-blue-600 hover:border-blue-700 overflow-hidden">
              {userInfo?.phone}
            </p>
          </div>

          <div>
            <label htmlFor="DateOfBirth">DOB</label>
            <br />
            <p className="pr-5 pt-2 border-solid border-b-4 capitalize border-blue-600 hover:border-blue-700 overflow-hidden">
              {userInfo?.dateOfBirth
                ? new Date(userInfo.dateOfBirth).toLocaleDateString()
                : ""}
            </p>
          </div>
          <div>
            <label htmlFor="Gender">Gender</label>
            <br />
            <p className="pr-5 pt-2 border-solid border-b-4 capitalize border-blue-600 hover:border-blue-700 overflow-hidden">
              {userInfo?.gender}
            </p>
          </div>
          <br />
          <button
            onClick={handleRouteToNextPage}
            className="inline-flex items-center justify-center px-6 py-3 mt-3 font-semibold text-white transition-all duration-200 bg-blue-600 rounded-md hover:bg-blue-700 focus:bg-blue-700"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center">
      <UserProfForm submit={submit} />
    </div>
  );
}

export default UserInfo;
