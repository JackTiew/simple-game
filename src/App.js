import { useEffect, useState } from "react";
import './App.css';
import CommonHelper from "./libraries/CommonHelper";
import Card from "./components/Card";

const App = () => {

	const commonHelper = CommonHelper();
	const [ showDict, setShowDict ] = useState(false);
	const [ dict, setDict ] = useState('Apple:Epal\nBanana:Pisang\nWatermelon:Tembikai\nPineapple:Nanas\nPapaya:Betik\nStrawbeery:Strawberi\nOrange:Oren\nDragonfruit:Pitaya\nGrape:Anggur\nBlueberry:Beri Biru');
	const [ items, setItems ] = useState([]);
	const [ openedItems, setOpenedItems ] = useState([]);
	const [ cards, setCards ] = useState([]);
	const [ isWinShow, setIsWinShow ] = useState(false);

	useEffect(() => {
		const handleKeyPress = (event) => {
			if (event.keyCode === 96) {
				event.preventDefault();
				setShowDict(prev => {
					if (prev === true) {
						setIsWinShow(false);
						resetItems();
					}
					return !prev;
				});
			}
		};

		window.addEventListener('keypress', handleKeyPress);

		return () => window.removeEventListener('keypress', handleKeyPress);
	}, [ dict ]);

	const resetItems = () => {
		const item = dict.split('\n').map(item => item.split(':'));
		const card = [];
		let index = 1;

		item.forEach(x => {
			x.forEach(y => {
				card.push({
					label: y,
					isOpen: false,
					id: index++
				});
			})
		});

		setCards(commonHelper.shuffle(card));
		setItems(item);
	};

	useEffect(() => {
		const doWork = async() => {
			if (openedItems.length === 2) {
				let card1 = document.getElementById(`card-${openedItems[0].id}`);
				let card2 = document.getElementById(`card-${openedItems[1].id}`);

				if (isCardMatch(openedItems)) { //match
					card1.firstChild.classList.add('correct-card');
					card2.firstChild.classList.add('correct-card');
					setOpenedItems([]);

					let openedCards = document.querySelectorAll(`.correct-card`);
					if (openedCards.length === cards.length) {
						await commonHelper.delay(1000);
						setIsWinShow(true);
					}
				} else { //not match
					card1.firstChild.classList.add('wrong-card');
					card2.firstChild.classList.add('wrong-card');
					await commonHelper.delay(1000);
					card1.firstChild.classList.remove('wrong-card');
					card2.firstChild.classList.remove('wrong-card');
					setCards(cards.map(card => 
						openedItems.some(item => item.label === card.label) ? {...card, isOpen: false} : card
					));
					setOpenedItems([]);
				}
			}
		}

		doWork();
	}, [ openedItems ]);

	const handleCardClick = (selectedCard) => {
		if (openedItems.length < 2 && !(openedItems.some(item => item.label === selectedCard.label))) {
			setCards(cards.map(card => 
				card.label === selectedCard.label ? {...card, isOpen: true} : card
			));
			setOpenedItems([ ...openedItems, selectedCard]);
		}
	};

	const isCardMatch = (cards) => {
		let isMatch = false;

		items.forEach(item => {
			if (item.includes(cards[0].label) && item.includes(cards[1].label)) {
				isMatch = true;
			}
		});

		return isMatch;
	};

	return (
		<div>
			<div className='flex justify-center text-[30px] mt-[20px]'>
				Please enter ` to show dictiornary or reset
			</div>
			<div className={`${showDict ? 'show-dict' : 'hide-dict' } flex justify-center w-screen h-[80dvh] pt-[10px] relative`}>
				<textarea className='w-[80%] p-[20px] outline text-[#000000] text-[2rem] resize-none' value={dict} onChange={event => { console.log(event.target.value); setDict(event.target.value)}} />
			</div>
			<div className='absolute h-dvh w-dvw top-0' style={{ zIndex: 2, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: isWinShow ? 'block' : 'none' }}>
				<img className='absolute top-[50%] left-[50%]' style={{ transform: 'translate(-50%, -50%)'}} src='happy.gif' alt='' />
			</div>
			<div className='absolute top-[10%] left-[25%] w-[50%] h-[90%]'>
				<div className='grid grid-cols-5 gap-x-[50px] gap-y-[200px] z-1' style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))'}}>
					{
						cards.map((card, index) => (
							<Card key={index} index={index} item={card} onCardClick={handleCardClick}/>
						))
					}
				</div>
			</div>
		</div>
	)
}

export default App