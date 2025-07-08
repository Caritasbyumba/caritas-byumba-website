import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Aboutus from './pages/Aboutus';
import Donation from './pages/donation/Donation';
import Projects from './pages/projects/Projects';
import Publications from './pages/publications/Publications';
import Contactus from './pages/Contactus';
import Project from './pages/projects/Project';
import Publication from './pages/publications/Publication';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/admin/Dashboard';
import AdminHome from './pages/admin/AdminHome';
import CarouselAuthor from './pages/admin/items/CarouselAuthor';
import MoreonusAuthor from './pages/admin/items/MoreonusAuthor';
import ProjectsAuthor from './pages/admin/items/ProjectsAuthor';
import PartnersAuthor from './pages/admin/items/PartnersAuthor';
import AdminAboutus from './pages/admin/AdminAboutus';
import AboutusAuthor from './pages/admin/items/AboutusAuthor';
import QuotesAuthor from './pages/admin/items/QuotesAuthor';
import AdminProjects from './pages/admin/AdminProjects';
import AdminPublications from './pages/admin/AdminPublications';
import AdminContactus from './pages/admin/AdminContactus';
import ProjectsIntroAuthor from './pages/admin/items/ProjectsIntroAuthor';
import PublicationsIntroAuthor from './pages/admin/items/PublicationsIntroAuthor';
import PublicationsAuthor from './pages/admin/items/PublicationAuthor';
import FaqAuthor from './pages/admin/items/FaqAuthor';
import Checkout from './pages/donation/Checkout';
import DonationAreasAuthor from './pages/admin/items/DonationAreasAuthor';
import DonateIntroAuthor from './pages/admin/items/DonateIntroAuthor';
import AdminDonation from './pages/admin/AdminDonation';
import DepartmentAuthor from './pages/admin/items/DepartmentsAuthor';
import ServiceAuthor from './pages/admin/items/ServicesAuthor';
import ChartAuthor from './pages/admin/items/ChartAuthor';
import Adverts from './pages/adverts/Adverts';
import Advert from './pages/adverts/Advert';
import AdminAdverts from './pages/admin/AdminAdverts';
import AdvertsAuthor from './pages/admin/items/AdvertAuthor';
import AdvertsIntroAuthor from './pages/admin/items/AdvertsIntroAuthor';
import DonationMessageAuthor from './pages/admin/items/DonationMessageAuthor';

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
          path="/dashboard/item/chart"
          component={ChartAuthor}
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
          path="/dashboard/adverts"
          component={AdminAdverts}
        />
        <ProtectedRoute
          exact
          path="/dashboard/item/adverts"
          component={AdvertsAuthor}
        />
        <ProtectedRoute
          exact
          path="/dashboard/item/advertsintro"
          component={AdvertsIntroAuthor}
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
        <ProtectedRoute
          exact
          path="/dashboard/item/donationmessage"
          component={DonationMessageAuthor}
        />
      </Switch>
    </Router>
  );
}

export default App;
