import classes from './components/Home.module.css';
import MainDispalyModule from './components/MainDisplayModule';
import HomeAccountHeader from './components/HomeAccountHeader';
import HomeRender from './components/HomeRender';
import { useParams } from 'react-router-dom';
import Search from './components/Search';
import { useSelector } from 'react-redux';

function Home() {
	const { searchModalIsOpen } = useSelector((state) => state.user);

	return (
		<div className={classes.home}>
			{searchModalIsOpen && <Search />}
			<MainDispalyModule>
				<HomeAccountHeader />
				<HomeRender />
			</MainDispalyModule>
		</div>
	);
}

export default Home;
