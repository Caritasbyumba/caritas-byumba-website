import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Pages/Home';
import Aboutus from './Pages/Aboutus';
import Donation from './Pages/Donation/Donation';
import Projects from './Pages/Projects/Projects';
import Publications from './Pages/publications/Publications';
import Contactus from './Pages/Contactus';
import Project from './Pages/Projects/Project';
import Publication from './Pages/publications/Publication';
import Login from './Pages/Login';
import ProtectedRoute from './Components/ProtectedRoute';
import Dashboard from './Pages/Admin/Dashboard';
import AdminHome from './Pages/Admin/AdminHome';
import CarouselAuthor from './Pages/Admin/Items/CarouselAuthor';
import MoreonusAuthor from './Pages/Admin/Items/MoreonusAuthor';
import ProjectsAuthor from './Pages/Admin/Items/ProjectsAuthor';
import PartnersAuthor from './Pages/Admin/Items/PartnersAuthor';
import AdminAboutus from './Pages/Admin/AdminAboutus';
import AboutusAuthor from './Pages/Admin/Items/AboutusAuthor';
import QuotesAuthor from './Pages/Admin/Items/QuotesAuthor';
import AdminProjects from './Pages/Admin/AdminProjects';
import AdminPublications from './Pages/Admin/AdminPublications';
import AdminContactus from './Pages/Admin/AdminContactus';
import ProjectsIntroAuthor from './Pages/Admin/Items/ProjectsIntroAuthor';
import PublicationsIntroAuthor from './Pages/Admin/Items/PublicationsIntroAuthor';
import PublicationsAuthor from './Pages/Admin/Items/PublicationAuthor';
import FaqAuthor from './Pages/Admin/Items/FaqAuthor';
import Checkout from './Pages/Donation/Checkout';
import DonationAreasAuthor from './Pages/Admin/Items/DonationAreasAuthor';
import DonateIntroAuthor from './Pages/Admin/Items/DonateIntroAuthor';
import AdminDonation from './Pages/Admin/AdminDonation';
import DepartmentAuthor from './Pages/Admin/Items/DepartmentsAuthor';
import ServiceAuthor from './Pages/Admin/Items/ServicesAuthor';
import Adverts from './Pages/Adverts/Adverts';
import Advert from './Pages/Adverts/Advert';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/aboutus" component={Aboutus} />
        <Route exact path="/donate" component={Donation} />
        <Route exact path="/donate/checkout" component={Checkout} />
        <Route exact path="/projects" component={Projects} />
        <Route exact path="/projects/:projectId" component={Project} />
        <Route exact path="/adverts" component={Adverts} />
        <Route exact path="/adverts/:advertId" component={Advert} />
        <Route exact path="/publications" component={Publications} />
        <Route
          exact
          path="/publications/:publicationId"
          component={Publication}
        />
        <Route exact path="/contactus" component={Contactus} />
        <Route exact path="/login" component={Login} />
        <ProtectedRoute exact path="/dashboard" component={Dashboard} />
        <ProtectedRoute exact path="/dashboard/home" component={AdminHome} />
        <ProtectedRoute
          exact
          path="/dashboard/item/carousels"
          component={CarouselAuthor}
        />
        <ProtectedRoute
          exact
          path="/dashboard/item/moreonus"
          component={MoreonusAuthor}
        />
        <ProtectedRoute
          exact
          path="/dashboard/item/projects"
          component={ProjectsAuthor}
        />
        <ProtectedRoute
          exact
          path="/dashboard/item/partners"
          component={PartnersAuthor}
        />

        <ProtectedRoute
          exact
          path="/dashboard/aboutus"
          component={AdminAboutus}
        />
        <ProtectedRoute
          exact
          path="/dashboard/item/aboutus"
          component={AboutusAuthor}
        />
        <ProtectedRoute
          exact
          path="/dashboard/item/quotes"
          component={QuotesAuthor}
        />
        <ProtectedRoute
          exact
          path="/dashboard/item/departments"
          component={DepartmentAuthor}
        />
        <ProtectedRoute
          exact
          path="/dashboard/item/services"
          component={ServiceAuthor}
        />

        <ProtectedRoute
          exact
          path="/dashboard/projects"
          component={AdminProjects}
        />
        <ProtectedRoute
          exact
          path="/dashboard/item/projectsintro"
          component={ProjectsIntroAuthor}
        />

        <ProtectedRoute
          exact
          path="/dashboard/publications"
          component={AdminPublications}
        />
        <ProtectedRoute
          exact
          path="/dashboard/item/publications"
          component={PublicationsAuthor}
        />
        <ProtectedRoute
          exact
          path="/dashboard/item/publicationsintro"
          component={PublicationsIntroAuthor}
        />
      

        <ProtectedRoute
          exact
          path="/dashboard/contactus"
          component={AdminContactus}
        />
        <ProtectedRoute
          exact
          path="/dashboard/item/faqs"
          component={FaqAuthor}
        />

        <ProtectedRoute
          exact
          path="/dashboard/donate"
          component={AdminDonation}
        />
        <ProtectedRoute
          exact
          path="/dashboard/item/donationintro"
          component={DonateIntroAuthor}
        />
        <ProtectedRoute
          exact
          path="/dashboard/item/donationareas"
          component={DonationAreasAuthor}
        />
      </Switch>
    </Router>
  );
}

export default App;
