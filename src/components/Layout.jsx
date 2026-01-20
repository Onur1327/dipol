import Navbar from './Navbar';
import Footer from './Footer';
import QuickContact from './QuickContact';

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <QuickContact />
    </div>
  );
};

export default Layout;

