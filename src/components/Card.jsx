import '../styles/Card.scss';

const Card = (props) => {

    const { item, onCardClick } = props;
    const { label } = item;

    return (
        <div
            className={`${item.isOpen ? 'show-card' : 'hide-card' } card-container`}
            onClick={() => onCardClick(item)}
        >
            <p className='card-front'>{label}</p>
            <p className='card-back'></p>
        </div>
    )
}

export default Card