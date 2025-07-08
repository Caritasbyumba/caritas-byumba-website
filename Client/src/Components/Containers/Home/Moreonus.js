import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useFetchActiveMoreOnUsQuery } from '../../../Features/API/user-api-slice';
import { CardBody, PageTitle } from '../../text'; // Removed TextButton import
import Spinner from '../../UI/spinner';
import ErrorMessage from '../../UI/error-message';
import parse from 'html-react-parser';

// Backup data with cleaned HTML formatting
const BACKUP_DATA = [{
  "_id": { "$oid": "62d809aa68339ceec2a17d88" },
  "description": {
    "en": "<p>Caritas Byumba is the implementing organ of the diocese catholique de Byumba. Diocese catholique de Byumba exists under the Legal personality no 230/07...</p>",
    "fr": "<p>Caritas Byumba est l'organe d'exécution du diocèse catholique de Byumba...</p>",
    "rw": "<p>Caritas Byumba ni urwego rushyira mu bikorwa gahunda za diyosezi gatolika ya Byumba...</p>"
  },
  "callToActionBtn": {
    "en": "Learn more",
    "fr": "Apprendre plus",
    "rw": "Menya byinshi"
  },
  "callToActionLink": "/aboutus",
  "isActive": true,
  "createdBy": {
    "$oid": "62b7a365c0330ed073ba6844"
  },
  "updatedBy": {
    "$oid": "62b7a365c0330ed073ba6844"
  },
  "createdAt": {
    "$date": {
      "$numberLong": "1658325418661"
    }
  },
  "updatedAt": {
    "$date": {
      "$numberLong": "1667286377674"
    }
  },
  "__v": 0
}];

const Moreonus = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { 
    data: apiResponse,
    isFetching, 
    isError, 
    error, 
    refetch 
  } = useFetchActiveMoreOnUsQuery();
  
  const selectedLanguage = useSelector(
    (state) => state.global?.selectedLanguage || 'en'
  );

  const [dataSource, setDataSource] = React.useState('loading');

  const moreonusData = React.useMemo(() => {
    try {
      // Try API data first
      if (apiResponse) {
        const responseData = Array.isArray(apiResponse) 
          ? apiResponse 
          : apiResponse.results || apiResponse.data;
        
        if (responseData?.length) {
          setDataSource('api');
          return responseData[0];
        }
      }
      
      // Fallback to backup
      setDataSource('backup');
      return BACKUP_DATA[0];
      
    } catch (error) {
      console.error('Data loading error:', error);
      setDataSource('backup');
      return BACKUP_DATA[0];
    }
  }, [apiResponse]);

  const descriptionContent = React.useMemo(() => {
    if (!moreonusData) return parse('<p>Loading content...</p>');
    
    const description = moreonusData.description || {};
    const text = description[selectedLanguage] || description.en || '';
    return parse(text);
  }, [moreonusData, selectedLanguage]);

  // Loading state only when trying API
  if (isFetching && dataSource === 'loading') {
    return <Spinner />;
  }

  // Error state with option to retry
  if (isError && dataSource !== 'backup') {
    return (
      <div className="error-container">
        <ErrorMessage error={error} retryFn={refetch} />
        <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
          <p className="text-yellow-700">
            {t('Showing previously saved content')}
          </p>
        </div>
        {renderContent()}
      </div>
    );
  }

  function renderContent() {
    return (
      <div className="moreonus-section">
        <PageTitle
          name={t('About us')}
          color="red"
          alignment="center"
          mobileAlignment="center"
          additional="py-2"
        />
        
        <div className="w-90% md:w-70% flex md:space-x-5 m-auto py-10">
          <div className="w-none md:w-4 bg-gray-200"></div>
          <div className="content-wrapper">
            <CardBody
              name={descriptionContent}
              additional="text-justify"
            />
            
            
            {/* Custom Button Implementation */}
            <div className="mt-8 flex justify-center">
            <button
              onClick={() => history.push(moreonusData?.callToActionLink || '/aboutus')}
              className={`
                min-w-[180px] py-3 px-6 rounded-lg
                bg-red-800 text-red font-bold
                hover:bg-red-700 active:bg-red-800
                transition-colors duration-200
                shadow-md hover:shadow-lg
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
              `}
            >
              {moreonusData?.callToActionBtn?.[selectedLanguage] || t('Learn more')}
            </button>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <>
      {dataSource === 'backup' && (
        <div className="backup-notice bg-amber-50 text-amber-800 p-3 mb-6 rounded-md text-center">
          <i className="fas fa-info-circle mr-2"></i>
          {t()}
        </div>
      )}
      {renderContent()}
    </>
  );
};

export default Moreonus;