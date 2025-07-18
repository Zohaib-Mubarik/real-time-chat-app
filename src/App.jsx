import './index.css';
import { ZIM } from 'zego-zim-web';
import { useState, useEffect, useRef } from 'react';

function App() {
  const [zimInstance, setzimInstance] = useState(null);
  const [userInfo, setuserInfo] = useState(null);
  const [messageText, setmessageText] = useState("");
  const [Messages, setMessages] = useState([]);
  const [selectedUser, setselectedUser] = useState('Zohaib Mubarik');
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const messageEndRef = useRef(null);

  const appID = 1987108025;
  const tokenA = "04AAAAAGh7mTEADL+OKrlRYKY2ZR89WwC5hZ2bntVeoC6Aow52hK61/BdROxzojysaQAGj+Jyf5WJkHgN0+Y/hkpJw6xyQUZ406Qz/ZMHYTopPtE9kQjinaCIsgPZeCHO7rd9R83aK6kZe+teRelfRMLZvlVjAY58QTekhww85uwF3QraKgl9s/1TkGp+Yhi5gXxecQ23ZW3jXHOkW6wU5FRbbzVuIMH8Fac95xQbt5JrWFusz2rl57fpHCLztSVoSttNXQn8jTnQwcVkUqeFsUkwB";
  const tokenB = "04AAAAAGh7mUYADLrmoy0E/6rh5Fh/sQCzO9KvX/U5MrfZoHP/IPtW7nz2Ngy8xo0A12fVplNFDCyJhwijIXxVNQxHx2fkYUEsIxf/fCKMwkJW2fvauPqB/kqhf1kYUCwCaGN7gKUb4dQYOHM2W1Dhpe+TOrpKMvZhqjs7z1LGZpYENxyWc0dr1gbZHGDgulcLxMrgqHwshk7vOy+cZmxVkh+Frn95lI6sKGHO4JrZPG1yKg3gtibFZO1AblhXMkxpXSBH3plW1ZqDO84B";

  useEffect(() => {
    const instance = ZIM.create(appID);
    setzimInstance(instance);

    instance.on('error', (zim, errorInfo) => {
      console.log('error', errorInfo.code, errorInfo.message);
    });

    instance.on('connectionStateChanged', (zim, { state, event }) => {
      console.log('connectionStateChanged', state, event);
    });

    instance.on('peerMessageReceived', (zim, { messageList }) => {
      setMessages(prev => [...prev, ...messageList]);
    });

    instance.on('tokenWillExpire', (zim, { second }) => {
      console.log('tokenWillExpire', second);
      const token = selectedUser === "Zohaib Mubarik" ? tokenA : tokenB;
      zim.renewToken(token)
        .then(() => console.log("Token-Renewed"))
        .catch(err => console.log(err));
    });

    return () => {
      instance.destroy();
    };
  }, [selectedUser]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [Messages]);

  const handleLogin = () => {
    const info = {
      userID: selectedUser,
      userName: selectedUser
    };

    const loginToken = selectedUser === "Zohaib Mubarik" ? tokenA : tokenB;
    setuserInfo(info);

    if (zimInstance) {
      zimInstance.login(info, loginToken)
        .then(() => {
          setisLoggedIn(true);
          console.log("loggedIn");
        })
        .catch(err => console.log(err));
    } else {
      console.log("Instance Error");
    }
  };

  const handleSendMessage = () => {
    if (!isLoggedIn) return;

    const toUser = selectedUser === "Zohaib Mubarik" ? "M Ibrahim" : "Zohaib Mubarik";
    const conversationType = 0;
    const config = { priority: 1 };
    const messageTextObj = { type: 1, message: messageText };

    zimInstance.sendMessage(messageTextObj, toUser, conversationType, config)
      .then(({ message }) => {
        setMessages(prev => [...prev, message]);
        setmessageText("");
      })
      .catch(err => console.log(err));
  };

  const formatTime = (timeStamp) => {
    const date = new Date(timeStamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div
      className="w-full h-screen bg-cover bg-center "
      style={{ backgroundImage: "url('/loginbg.jpg')" }} // Assuming image is in public/
    >
      <h1 className='flex justify-center font-extrabold text-3xl'>Real-Time ChatApp</h1>

      {!isLoggedIn ? (
            <div className='bg-white/20 w-[500px] h-[700px] shadow-xl flex justify-center items-center m-auto my-5 rounded-lg flex-col'>
              <div
      className="bg-cover bg-center bg-no-repeat w-[100px] h-[100px] rounded-full"
      style={{ backgroundImage: "url('/Me.png')" }}
    >
  
</div>
          
          <span className='font-extrabold text-4xl'>Welcome</span>
          <span className='font-bold text-2xl mb-4'>Sign In To Explore More...</span>
          <h1 className=' font-light text-sm'>Select User</h1>
          <select className='border rounded-xl w-[250px] h-[40px] text-center' onChange={(e) => setselectedUser(e.target.value)} value={selectedUser}>
            <option value="Zohaib Mubarik">Zohaib Mubarik</option>
            <option value="M Ibrahim">M Ibrahim</option>
          </select>
          <button
            className='text-white font-semibold h-[40px] w-[100px] rounded-3xl
              bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
              hover:brightness-110 transition duration-300 shadow-md mt-3 cursor-pointer'
            onClick={handleLogin}
          >
            Sign in
          </button>
          <div className='mt-3'>Don't have an account <span className='text-blue-500 underline cursor-pointer'>create account</span></div>
          <h3 className=' mt-3 text-sm  text-gray-600'>Or Sign up Using</h3>
          <div className='flex justify-center my-3'>
        <div className="w-[50px] mr-2.5 cursor-pointer"> <img  src="./fb.png" alt="" /> </div>
        <div className="w-[50px] mr-2.5 cursor-pointer"> <img  src="./x.png" alt="" /> </div>
        <div className="w-[50px] cursor-pointer"> <img  src="./g.png" alt="" /> </div>
        </div>


        </div>
      ) : (
        <div className='bg-white/20 w-[40%] h-[85%] my-5 rounded-lg shadow-2xl m-auto relative'>
          <h1 className='mx-5 font-bold pt-5'><span className='font-light'>Sending Message To: </span>{selectedUser === "Zohaib Mubarik" ? "M Ibrahim" : "Zohaib Mubarik"}</h1>
          <hr className='my-5 text-gray-400 ' />
          <div className='rounded-2xl w-full p-[20px] flex flex-col gap-[10px] items-center h-[400px] overflow-auto'>
            {Messages.map((msg, i) => {
              const isOwnMessage = msg.senderUserID === userInfo.userID;
              return (
                <div key={i} className={`w-full flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                  <div className={`px-[20px] py-[10px] shadow-lg ${isOwnMessage ? "bg-black rounded-br-0 rounded-t-2xl rounded-bl-2xl" : "bg-black rounded-bl-0 rounded-t-2xl rounded-br-2xl"} text-white`}>
                    <div>{msg.message}</div>
                    <div className='text-[13px] text-gray-400'>{formatTime(msg.timestamp)}</div>
                  </div>
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </div>

          {/* Input & Button outside scrollable area */}
          <div className='absolute bottom-5 left-0 w-full flex items-center justify-center gap-[20px] px-[20px]'>
            <input
              type="text"
              placeholder='Message'
              className='rounded-2xl bg-gray-700 outline-none text-white px-[20px] py-[10px] placeholder-white w-full'
              onChange={(e) => setmessageText(e.target.value)}
              value={messageText}
            />
            <button className='text-white font-semibold h-[40px] w-[100px] rounded-3xl
              bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
              hover:brightness-110 transition duration-300 shadow-md cursor-pointer' onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
