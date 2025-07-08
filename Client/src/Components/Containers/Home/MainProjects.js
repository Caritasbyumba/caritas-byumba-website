import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchActiveMainProjectsQuery } from '../../../Features/API/user-api-slice';
import { NormalText, PageTitle, SectionTitle } from '../../text';
import { useSelector } from 'react-redux';
import { Button } from '../../UI/button';
import Spinner from '../../UI/spinner';
import { useHistory } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const MainProjects = () => {
  const { data, isFetching, isError } = useFetchActiveMainProjectsQuery();
  const { t } = useTranslation(); // Fixed this line - removed the quotes
  const selectedLanguage = useSelector((state) => state.global.selectedLanguage);
  const history = useHistory();
  
  const allProjects = data?.results || [];
  const mainProjects = allProjects.slice(0, 3);
  const otherProjects = allProjects.slice(3);

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <NormalText 
          name={t("Failed to load projects. Please try again later.")} 
          color="text-red-500"
        />
      </div>
    );
  }

  const ProjectCard = ({ project }) => (
    <div 
      className="group relative rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl h-[420px] flex flex-col bg-white"
      aria-labelledby={`project-title-${project._id}`}
    >
      <div className="relative h-60 w-full overflow-hidden">
        <LazyLoadImage
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          effect="blur"
          placeholderSrc="/images/placeholder.jpg"
          src={`${process.env.REACT_APP_BACKEND_URL}/images/${project.gallery[0]}`}
          alt={project.name}
          width="100%"
          height="100%"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 
          id={`project-title-${project._id}`}
          className="text-xl font-bold text-gray-800 mb-2 line-clamp-1"
        >
          {project.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {project.smallDescription[selectedLanguage]}
        </p>
        
        <div className="mt-auto">
          <Button
            name={t('Read More')}
            isSquare
            outline="false"
            color="red"
            clicked={() => history.push(`/projects/${project._id}`)}
            aria-label={`Read more about ${project.name}`}
          />
        </div>
      </div>
    </div>
  );

  return (
    <section className="container mx-auto px-4 py-12 lg:py-16">
      <PageTitle
        name={t('Our Projects')}
        color="red"
        alignment="center"
        mobileAlignment="center"
        additional="py-5 mb-8"
      />
  
      {allProjects.length === 0 ? (
        <div className="w-full p-8 text-center bg-gray-50 rounded-lg">
          <NormalText 
            name={t("No projects available at the moment")} 
            color="text-gray-500"
          />
        </div>
      ) : (
        <>
          {/* Main Projects (First 3) */}
          <div className="mb-16">
            <div className="grid grid-cols-1 min-[700px]:grid-cols-2 lg:grid-cols-3 gap-8">
              {mainProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          </div>

          {/* Other Projects (Rest) - Will only show if there are more than 3 projects */}
          {otherProjects.length > 0 && (
            <div className="mt-20">
              <SectionTitle
                name={t('Other Projects')}
                alignment="center"
                additional="mb-10"
              />
              
              <div className="grid grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherProjects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default MainProjects;