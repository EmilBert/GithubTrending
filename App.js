import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Repo = (props) => {
  return (
    <View style={styles.repo}>
      <Text style={styles.repoName}>{props.name}</Text>
      <Text style={styles.repoDescription}>{props.description}</Text>
      <Text style={styles.repoStars}>{props.stars}</Text>
    </View>
  );
}

export default function App() {
  const [data, setData] = useState({ hits: [] });

  useEffect(async () => {
    const response = await fetch("https://api.github.com/search/repositories?q=language:python&state:open&order=desc&sort=stars&created:created:2022-11-22");
    const repositories = await response.json();
  
    setData(result.data);
  });
  
  return (
    <View style={styles.container}>
      {data.hits.map(repo => <Repo name={repo.name} description={repo.description} stars={repo.stars} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
