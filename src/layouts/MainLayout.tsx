import { Outlet } from 'react-router';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { DemoToolsBar } from '../components/demo/DemoToolsBar';

export const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
            <Header />
            <main className="flex-grow pt-16">
                <Outlet />
            </main>
            <DemoToolsBar />
            <Footer />
        </div>
    );
};
