import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Fragment } from "react";

const EmailVerify = () => {
  const [validUrl, setValidUrl] = useState(true);
  const param = useParams();
  console.log(`param id is: ${param.id} and param token is: ${param.token}`);

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `http://localhost:3000/api/users/${param.id}/verify/${param.token}`;
        const { data } = await axios.get(url);
        console.log(data);
        setValidUrl(true);
      } catch (error) {
        console.log(error);
        setValidUrl(false);
      }
    };
    verifyEmailUrl();
  }, [param]);

  return (
    <Fragment>
      {validUrl ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="text-center">
            <img src="/right.jpg" alt="success_img" className="mx-auto w-24 h-24 mb-4" />
            <h1 className="text-2xl font-semibold text-green-600">Email verified successfully</h1>
            <Link to="/login">
              <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Login
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <h1 className="text-3xl font-semibold text-red-600">404 Not Found</h1>
        </div>
      )}
    </Fragment>
  );
};

export default EmailVerify;
