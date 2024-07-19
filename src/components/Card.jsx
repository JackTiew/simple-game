import '../styles/Card.scss';

const Card = (props) => {

    const { item, index } = props;
    const { onCardClick } = props;
    const { id, label } = item;

    return (
        <div
            id={`card-${id}`}
            className={`${item.isOpen ? 'show-card' : 'hide-card' } card-container`}
            onClick={() => onCardClick(item)}
        >
            <p className='card-front'>{label}</p>
            <p className='card-back'>{index + 1}</p>
        </div>
    )
}

export default Card