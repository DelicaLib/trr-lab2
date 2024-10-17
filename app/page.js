"use client";

import { useState, useEffect } from 'react';
import Web3 from 'web3';
import styles from './styles.module.css'; // Подключаем CSS файл

export default function Home() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [message, setMessage] = useState('');
  const [tag, setTag] = useState(''); // Поле для тега поста
  const [posts, setPosts] = useState([]);
  const [tagFilter, setTagFilter] = useState(''); // Поле для фильтрации

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();

      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const abi = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "content",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "string",
          "name": "tag",
          "type": "string"
        }
      ],
      "name": "NewPost",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "posts",
      "outputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "content",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "tag",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "string",
          "name": "content",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "tag",
          "type": "string"
        }
      ],
      "name": "post",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getPosts",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "content",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "tag",
              "type": "string"
            }
          ],
          "internalType": "struct Poster.Post[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];
      const address = "0x8A81D40512fc8b760e6ecc305612f393ABE9E436";
      const posterContract = new web3.eth.Contract(abi, address);
      setContract(posterContract);

      const fetchedPosts = await posterContract.methods.getPosts().call();
      setPosts(fetchedPosts);
    } else {
      alert('Please install MetaMask!');
    }
  };

  const handlePostMessage = async () => {
    if (contract && message && tag) { // Убедимся, что оба поля заполнены
      await contract.methods.post(message, tag).send({ from: account });
      setMessage('');
      setTag(''); // Очистка поля тега после публикации
      loadBlockchainData(); // Перезагрузка постов
    }
  };

  const handleFilterPosts = () => {
    if (tagFilter) {
      const filteredPosts = posts.filter(post => post.tag === tagFilter);
      setPosts(filteredPosts);
    } else {
      loadBlockchainData(); // Перезагрузка всех постов, если фильтр очищен
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Poster dApp</h1>
      <p className={styles.account}>Account: {account}</p>

      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Enter a tag"
          value={tag} // Используем tag для ввода тега поста
          onChange={(e) => setTag(e.target.value)}
          className={styles.input}
        />
        <button onClick={handlePostMessage} className={styles.button}>Post Message</button>
      </div>

      <div className={styles.filterContainer}>
        <input
          type="text"
          placeholder="Filter by tag"
          value={tagFilter} // Используем tagFilter для фильтрации постов
          onChange={(e) => setTagFilter(e.target.value)}
          className={styles.input}
        />
        <button onClick={handleFilterPosts} className={styles.button}>Apply Filter</button>
      </div>

      <h2 className={styles.subtitle}>All Posts</h2>
      <ul className={styles.postList}>
        {posts.map((post, index) => (
          <li key={index} className={styles.postItem}>
            <p><strong>Message:</strong> {post.content}</p>
            <p><strong>Tag:</strong> {post.tag}</p>
            <p><strong>User:</strong> {post.user}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

