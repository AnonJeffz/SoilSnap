import SoilLocation from '../../components/map/mymap';
import PageMeta from '../../components/common/PageMeta';
import SoilList from '../../components/soil/SoilList';
import Details from '../../components/soil/SoilDetails';
import { Link } from 'react-router';

export default function SoilDetails() {
  return (
    <>
      <PageMeta
        title="SoilSnap | Soil Details"
        description="SoilSnap Soil Details Page."
        
      />
      <Link to={'/soil'} className='mb-2 dark:text-white'>Back</Link>
      <Details />
    </>
  );
}
