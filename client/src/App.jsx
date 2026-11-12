import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./views/Home";
import Catalog from "./views/Catalog";
import Details from "./views/Details";
import CreateTrail from "./views/CreateTrail";
import EditTrail from "./views/EditTrail";
import MyTrails from "./views/MyTrails";
import Login from "./views/Login";
import Register from "./views/Register";
import NotFound from "./views/NotFound";
import AuthGuard from "./components/guards/AuthGuard";
import GuestGuard from "./components/guards/GuestGuard";

export default function App() {
    return (
        <div className="app">
            <Navbar />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/trails" element={<Catalog />} />
                    <Route path="/trails/:trailId" element={<Details />} />

                    <Route element={<AuthGuard />}>
                        <Route
                            path="/trails/create"
                            element={<CreateTrail />}
                        />
                        <Route
                            path="/trails/:trailId/edit"
                            element={<EditTrail />}
                        />
                        <Route path="/profile" element={<MyTrails />} />
                    </Route>

                    <Route element={<GuestGuard />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}
