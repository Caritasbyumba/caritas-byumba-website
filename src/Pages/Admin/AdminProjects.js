import React from 'react';
import Footer from '../../components/containers/Footer';
import Header from '../../components/containers/Header';
import {
  useFetchActiveProjectsIntroQuery,
  useFetchActiveProjectsQuery,
} from '../../features/API/user-api-slice';
import Spinner from '../../components/UI/spinner';
import { CardBody, PageTitle } from '../../components/text';
import { useSelector } from 'react-redux';
import Project from '../../components/containers/projects/Project';
import CustomHelmet from '../../components/UI/Helmet';
import Wrapper from '../../components/containers/admin/Wrapper';

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
