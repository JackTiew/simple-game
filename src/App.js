import { useEffect, useState } from "react";
import './App.css';
import CommonHelper from "./libraries/CommonHelper";
import Card from "./components/Card";

const App = () => {

	const commonHelper = CommonHelper();
	const [ showDict, setShowDict ] = useState(false);
	const [ dict, setDict ] = useState('');
	const [ items, setItems ] = useState([]);
	const [ openedItems, setOpenedItems ] = useState([]);
	const [ cards, setCards ] = useState([]);

// Apple:苹果
// Banana:香蕉
// Watermelon:西瓜
// Pineapple:黄梨
// Durian:榴莲
// Kiwi:奇异果
// Orange:橙
// Dragonfruit:火龙果
// Grape:葡萄
// Blueberry:蓝莓

	useEffect(() => {
		const handleKeyPress = (event) => {
			if (event.keyCode === 96) {
				event.preventDefault();
				setShowDict(prev => {
					if (prev === true) {
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

		item.forEach(x => {
			x.forEach(y => {
				card.push({
					label: y,
					isOpen: false
				});
			})
		});

		setCards(commonHelper.shuffle(card));
		setItems(item);
	};

	useEffect(() => {
		const doWork = async() => {
			if (openedItems.length === 2) {
				if (isCardMatch(openedItems)) { //match
					setOpenedItems([]);
				} else { //not match
					await commonHelper.delay(2000);
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
		setCards(cards.map(card => 
			card.label === selectedCard.label ? {...card, isOpen: true} : card
		));
		setOpenedItems([ ...openedItems, selectedCard]);
	};

	const isCardMatch = (cards) => {
		let isMatch = false;

		items.forEach(item => {
			console.log(item.includes(cards[0].label));
			console.log(item.includes(cards[1].label));
			if (item.includes(cards[0].label) && item.includes(cards[1].label)) {
				isMatch = true;
			}
		});

		return isMatch;
	};

	return (
		<div>
			<div className={`${showDict ? 'show-dict' : 'hide-dict' } flex justify-center w-screen h-[80dvh] pt-[10px] relative`}>
				<textarea className='w-[80%] p-[20px] outline text-[#000000] text-[2rem] resize-none' value={dict} onChange={event => setDict(event.target.value)} />
			</div>
			<div className='absolute top-0 left-[10%] w-[80%] h-[90%] flex justify-center items-center'>
				<div className='grid grid-cols-5 gap-[200px] z-1'>
					{
						cards.map(card => (
							<Card item={card} onCardClick={handleCardClick}/>
						))
					}
				</div>
			</div>
		</div>
	)
}

export default App