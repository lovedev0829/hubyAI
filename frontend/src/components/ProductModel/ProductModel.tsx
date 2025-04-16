import { useLocation, useNavigate } from "react-router-dom";


const ProductModel = ({ onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = () => {
        navigate("/login", { state: { from: location } });
    };

    return (
        <div className="justify-center items-center backdrop-blur-sm flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="bg-white p-8 shadow-lg rounded-lg">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">Confirm?</h1>
                <p className="text-gray-600 mb-6">To save your product, you need to sign up or log in.</p>
                <div className="flex gap-[12px]">
                    <button className="border-[#000] border-[1px] bg-[#fff] rounded-lg h-[48px] max-w-[240px] w-full text-black roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg transition-all duration-300]"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleNavigation}
                        className="border-[#000] border-[1px] bg-[#000000] rounded-lg h-[48px] max-w-[240px] w-full text-white roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductModel