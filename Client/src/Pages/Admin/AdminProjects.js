import React from 'react';
import Footer from '../../Components/Containers/Footer';
import Header from '../../Components/Containers/Header';
import {
  useFetchActiveProjectsIntroQuery,
  useFetchActiveProjectsQuery,
} from '../../Features/API/user-api-slice';
import Spinner from '../../Components/UI/spinner';
import { CardBody, PageTitle } from '../../Components/text';
import { useSelector } from 'react-redux';
import Project from '../../Components/Containers/Projects/Project';
import CustomHelmet from '../../Components/UI/Helmet';
import Wrapper from '../../Components/Containers/Admin/Wrapper';

const AdminProjects = (props) => {
  const { data: projectsIntro = [], isFetching: isFetchingProjectsIntro } =
    useFetchActiveProjectsIntroQuery();
  const { data: projects = [], isFetching: isFetchingProjects } =
    useFetchActiveProjectsQuery();

  const selectedLanguage = useSelector(
    (state) => state.global.selectedLanguage
  );

  return (
    <div>
      <CustomHelmet name="PROJECTS" />
      <Header />
      {isFetchingProjectsIntro ? (
        <Spinner />
      ) : (
        <Wrapper {...props} item="projectsintro">
          <div className="bg-gray-200 py-5">
            <div className="w-90% lg:w-70% m-auto">
              <PageTitle
                name={projectsIntro.results.title[selectedLanguage]}
                color="red"
                additional="text-center py-5"
              />
              <CardBody
                name={projectsIntro.results.description[selectedLanguage]}
                additional="text-center"
              />
            </div>
          </div>
        </Wrapper>
      )}
      {isFetchingProjects ? (
        <Spinner />
      ) : (
        <Wrapper {...props} item="projects">
          <div className="w-90% lg:w-70% m-auto py-5 divide-y">
            {projects.results.map((project, index) => (
              <Project key={index} index={index} {...project} />
            ))}
          </div>
        </Wrapper>
      )}
      <Footer />
    </div>
  );
};

export default AdminProjects;
