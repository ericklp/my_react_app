function ChatRoom() {

    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limitToLast(25);
  
    const [messages] = useCollectionData(query, { idField: 'id' });
  
    return (<>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      </main>
  
    </>)
  }
  
  
  
  function ChatMessage(props) {
    const { text, uid, photoURL } = props.message;
  
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  
    return (<>
      <div className={`message ${messageClass}`}>
        <img src={photoURL} />
        <p>{text}</p>
      </div>
    </>)
  }
  