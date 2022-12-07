import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Linking} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const Repo = (props) => {
  return (
      <Pressable onPress={() => props.handleRepoClick(props.value)}>
        <View style={styles.repo}>
          <View style={{display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
            <Text style={styles.repoName}>{props.name}</Text>
            <Text style={styles.stars}>⭐{props.stars}</Text>
          </View>
          <Text style={styles.author}>{props.author}</Text>
          <br/>
          <Text style={{...styles.repoDescription}}>{ props.description != undefined && props.description.length > 100 ? props.description.substring(0,100)+"...": props.description}</Text>
        </View>
      </Pressable>
  );
}

const Modal = (props) => {
  return (
    <View style={props.show ? {...styles.modalStyle} : {...styles.modalStyle, visibility: "hidden"}}>
          <View style={{display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
            <Text style={styles.repoName}>{props.name}</Text>
            <Text style={styles.stars}>⭐{props.stars}</Text>
          </View>
          <Text style={{color: 'blue'}} onPress={() => Linking.openURL(props.url)}>{props.author}/{props.name}</Text>
          <br/>
          <Text style={styles.author}>Language: {props.language}</Text>
          <Text style={styles.author}>Author: {props.author}</Text>
          <br/>
          <Text style={styles.repoDescription}>{props.description}</Text>
    </View>
  );
}

export default function App() {
  // Dropdown states
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('python');
  const [items, setItems] = useState([
    {label: 'Python', value: 'python'},
    {label: 'C++', value: 'cpp'},
    {label: 'Java', value: 'java'},
    {label: 'JavaScript', value: 'javascript'},
    {label: 'C', value: 'c'},
    {label: 'C#', value: 'csharp'},
    {label: 'PHP', value: 'php'},
    {label: 'Ruby', value: 'ruby'},
    {label: 'Go', value: 'go'},
    {label: 'Swift', value: 'swift'},
    {label: 'Kotlin', value: 'kotlin'},
    {label: 'Rust', value: 'rust'},
    {label: 'TypeScript', value: 'typescript'},
  ]);

  // App states
  const [data, setData] = useState(null);
  const [repoInfoShow, setRepoInfoShow] = useState(false);
  const [currentKey, setCurrentKey] = useState(0);

  let fetchRequest="https://api.github.com/search/repositories?q=language:python&state:open&order=desc&sort=stars&per_page=30&pushed:>2022-11-24&stars:>20000";
  useEffect(() => {
    if(value != null) {
      fetchRequest= "https://api.github.com/search/repositories?q=language:" + value + "&state:open&order=desc&sort=stars&page=1&per_page=30&pushed:>=2022-12-1&stars:>100000";
    } 

    //Local function declaration
    const fetchRepos = async () => {
      const response = await fetch(fetchRequest);
      setData(await response.json());
    }

    fetchRepos();
  }, [value]);

  // Function to handle repo click
  const handleRepoClick = (value) => {
    setRepoInfoShow(!repoInfoShow);
    setCurrentKey(value);
  }

  if(data == null){
    return <Text>Loading...</Text>
  }

  return (
    <View style={styles.container}>
      <View>
        <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        containerStyle={{zIndex:1}}
      />
        {console.log(data)}
        {data.items.map((repo, index) => 
        
        currentKey != index ? 
        <Repo key = {index.toString()} value = {index} name={repo.name} description={repo.description} stars={repo.stargazers_count} author={repo.owner.login} handleRepoClick={handleRepoClick}/> 
        :
        <>
          <Repo key = {index.toString()} value = {index} name={repo.name} description={repo.description} stars={repo.stargazers_count} author={repo.owner.login} handleRepoClick={handleRepoClick}/> 
          <Pressable onPress={handleRepoClick} style={ repoInfoShow ? {...styles.overlay} :{...styles.overlay, visibility:"hidden"} }></Pressable>
          <Modal  show={repoInfoShow}
          value = {index} 
          name={repo.name} 
          description={repo.description} 
          stars={repo.stargazers_count} 
          author={repo.owner.login} 
          language={repo.language}
          url={repo.html_url}
          handleRepoClick={handleRepoClick} 
          />
        </>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  repo: {
    
    backgroundColor: '#eee',
    padding: 10,
    margin: 10,
    maxWidth: 500,
    height:"fit-content",
    borderRadius: 10,
  },
  repoName: {

    width: "80%",
    fontSize: 20,
    fontWeight: 'bold',
  },
  stars: {
    textAlign: "right",
    width: "20%",
  },

  author: {
    fontSize: 15,
    color: 'grey',
  },
  repoDescription: {
    fontSize: 15,
  },
  repoStars: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  modalStyle : {
    position: "fixed",
    zIndex: 1000,
    width: "95%",
    maxWidth: 500,
    maxHeight:400,
    overflow:"scroll-y",
    top:10,
    backgroundColor: 'white',
    padding: 10,
    marginLeft: 10,
   
    borderRadius: 10,
  },
  overlay: {
    position: "fixed",
    zIndex: 500,
    width: "100vw",
    height: "100vh",
    top:0,
    left:0,
    backgroundColor: 'black',
    opacity: 0.5,
  }

});
