import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const MainLayout = () => {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-10">
                <Outlet />
                
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;