import { useForm} from "react-hook-form";
import { useSelector } from "react-redux";



function UserProfForm({ submit }) {
    const { handleSubmit, register, formState: { errors } } = useForm();
    const userInfo = useSelector((state) => state.FetchUserProfInfoSlice.userProfileInfo);

    return (
        <div className="!w-100 !h-[100vh] flex justify-center items-center !py-96">
            <form
                className="user-info-card grid grid-cols-2 grid-rows-5 gap-2 rounded-md shadow-[6px_10px_8px_12px_rgba(0,_0,_0,_0.1)] px-10 py-5"
                onSubmit={handleSubmit(submit)}
            >
                <div>
                    <label htmlFor="name">Full name</label>
                    <br />
                    <input
                        type="text"
                        placeholder="Enter your name"
                        className="input input-bordered input-primary w-full max-w-xs"
                        defaultValue={userInfo?.name}
                        {...register("name", {
                            required: {
                                value: true,
                                message: "Full Name is Required",
                            },
                        })}
                    />
                    {errors.name && <p>{errors.name.message}</p>}
                </div>
                <div>
                    <label htmlFor="phone">phone</label>
                    <br />
                    <input
                        type="text"
                        placeholder="Enter your phone"
                        className="input input-bordered input-primary w-full max-w-xs"
                        defaultValue={userInfo?.phone}
                        {...register("phone", {
                            required: {
                                value: true,
                                message: "phone is Required",
                            },
                        })}
                    />
                    {errors.name && <p>{errors.name.message}</p>}
                </div>
                <div>
                    <label htmlFor="street">street</label>
                    <br />
                    <input
                        type="text"
                        placeholder="Enter Your street"
                        className="input input-bordered input-primary w-full max-w-xs"
                        defaultValue={userInfo?.street}
                        {...register("street", { required: false })}
                    />
                    {errors.name && <p>{errors.name.message}</p>}
                </div>
                <div>
                    <label htmlFor="postalCode">Pincode</label>
                    <br />
                    <input
                        type="text"
                        placeholder="Enter Your postalCode"
                        className="input input-bordered input-primary w-full max-w-xs"
                        defaultValue={userInfo?.postalCode}
                        {...register("postalCode", { required: false })}
                    />
                    {errors.name && <p>{errors.name.message}</p>}
     
                </div>
                <div>
                    <label htmlFor="city">city</label>
                    <br />
                    <input
                        type="text"
                        placeholder="Enter Your city"
                        className="input input-bordered input-primary w-full max-w-xs"
                        defaultValue={userInfo?.city}
                        {...register("city", { required: false })}
                    />
    
                </div>
                <div>
                    <label htmlFor="state">State</label>
                    <br />
                    <input
                        type="text"
                        placeholder="Enter Your State"
                        className="input input-bordered input-primary w-full max-w-xs"
                        defaultValue={userInfo?.state}
                        {...register("state", { required: false })}
                    />
             
                </div>
                <div>
                    <label htmlFor="country">Country</label>
                    <br />
                    <input
                        type="text"
                        placeholder="Enter Your Country"
                        className="input input-bordered input-primary w-full max-w-xs"
                        defaultValue={userInfo?.country}
                        {...register("country", { required: false })}
                    />
                 
                </div>
                <div>
                    <label htmlFor="dateOfBirth">DOB</label>
                    <br />

                    <input
                        type="date"
                        className="input input-bordered input-primary w-full max-w-xs"
                        {...register("dateOfBirth", {
                            required: {
                                value: true,
                                message: "DOB is Required",
                            },
                        })}
                    />
                    {errors.dateOfBirth && <p>{errors.dateOfBirth.message}</p>}

                </div>
                <div>
                    <label htmlFor="gender">Gender</label>
                    <br />
                    <div className="form-control">
                        <label className="label cursor-pointer justify-normal p-0">
                            <input
                                type="radio"
                                className="radio checked:bg-blue-500 h-4 w-4"
                                {
                                ...register("gender")
                                }
                                value="Male"
                            />
                            <span className="label-text px-4">Male</span>
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="label cursor-pointer justify-normal p-0">
                            <input
                                type="radio"
                                className="radio checked:bg-blue-500 h-4 w-4"
                                {
                                ...register("gender")
                                }
                                value="Female"
                            />
                            <span className="label-text px-4">Female</span>
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="label cursor-pointer justify-normal p-0">
                            <input
                                type="radio"
                                className="radio checked:bg-blue-500 h-4 w-4"
                                {
                                ...register("gender")
                                }
                                value="other"
                            />
                            <span className="label-text px-4">Other</span>
                        </label>
                    </div>

                </div>
                <br />

                <button
                    type="submit"
                    className="inline-flex items-center justify-center px-6 py-3 mt-3 font-semibold text-white transition-all duration-200 bg-blue-600 rounded-md hover:bg-blue-700 focus:bg-blue-700"
                >Submit</button>
            </form>
        </div>
    );
}

export default UserProfForm;
