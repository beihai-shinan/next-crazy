import { useState } from 'react';

import styles from './add-to-cart.module.scss';

export default function AddToCart() {
  const [showAdd, setShowAdd] = useState(false);
  const [showMinus, setShowMinus] = useState(false);
  const [count, setCount] = useState(0);
  const [amount, setAmount] = useState(10);

  const handleAdd = () => {
    setShowAdd(true);
    setShowMinus(false);
  }

  const handleMinus = () => {
    setShowAdd(false);
    setShowMinus(true);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.image}>
          <img src="https://img06.weeecdn.com/item/image/838/462/6A89E3C11DA96288.jpg!c340x0.webp" />
        </div>
        <div className={styles.btnWrapper}>
          <div data-count={count} className={`${styles.btnLeftWrapper} ${showAdd ? styles.animateLeft : ''} ${showMinus ? styles.animateRight : '' }` }>
            <div className={styles.btnLeft} onClick={handleMinus}>好</div>
            </div>
            <div className={styles.btnRight} onClick={handleAdd}>+</div>
          </div>
        <div className={styles.content}>
          Lian How Brand Sweet Bean Sauce  8 oz
        </div>
        <button onClick={() => setCount(count + 1)}>加购</button>
        <div>
          <div>
            <span>{`($${amount})`}</span>
          </div>
        </div>
      </div>
    </div>
  )
}