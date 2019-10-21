import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import React from 'react';
import { Animated, Dimensions, Easing, FlatList, PanResponder, StyleSheet, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const dislikePart = width / 4;
const likePart = width - dislikePart;
const swipeDistRequired = width / 3;

const getRandomColor = () => {
  const min = 50;
  const max = 255;
  const r = Math.floor(Math.random() * (max - min) + min);
  const g = Math.floor(Math.random() * (max - min) + min);
  const b = Math.floor(Math.random() * (max - min) + min);

  return `rgba(${r},${g},${b},1)`;
};


export default function App() {
  const valueXY = new Animated.ValueXY();
  const Pan = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        Animated.event([{
          x: valueXY.x,
          y: valueXY.y,
        }])({
          x:  gestureState.moveX - (this.cardWidth / 2),
          y: gestureState.moveY - (this.cardHeight / 2)
        })
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        distanceX = gestureState.dx < 0 ? gestureState.dx * -1 : gestureState.dx;
        if (gestureState.moveX < dislikePart) {
          console.log('dislike', gestureState)
          if (distanceX > swipeDistRequired) {
            return dislike()
          }
        }

        if (gestureState.moveX > likePart) {
          console.log('like', gestureState)
          if (distanceX > swipeDistRequired) {
            return like()
          }
        }

        getCardBack(100)
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
  });

  const dislike = () => {
    this.lastPosition = -(width * 2)
    Animated.timing(valueXY.x, {
      toValue: -(width * 2),
      easing: Easing.ease,
      duration: 500,
    }).start();
  }

  const getCardBack = (duration = 500) => {
    Animated.parallel([
      Animated.timing(valueXY.x, {
        toValue: 0,
        easing: Easing.ease,
        duration,
      }),
      Animated.timing(valueXY.y, {
        toValue: 0,
        easing: Easing.ease,
        duration,
      })
    ]).start()
  }

  const like = () => {
    this.lastPosition = width * 2
    Animated.timing(valueXY.x, {
      toValue: width * 2,
      easing: Easing.ease,
      duration: 500,
    }).start();
  }

  const t = valueXY.x.interpolate({
    inputRange: [0, 100],
    outputRange: ['0deg', '-5deg'],
  })

  const likeOpacity = valueXY.x.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [0, 0.5, 1],
  })

  const nopeOpacity = valueXY.x.interpolate({
    inputRange: [-100, -50, 0],
    outputRange: [1, 0.5, 0],
  })

  return (
    <View ref={(node) => this.container = node} style={styles.container}>
      {/* FOOTER */}
      <View style={styles.footer}>
        {/* NOPE */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={dislike}
          style={[styles.lgButton, styles.footerButton]}
        >
          <Entypo name='cross' size={38} color='#FF4B2B' />
        </TouchableOpacity>
        {/* BACK */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => getCardBack()}
          style={[styles.smButton, styles.footerButton]}
        >
          <FontAwesome name='undo' size={20} color='#f7971e' />
        </TouchableOpacity>
        {/* LIKE */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={like}
          style={[styles.lgButton, styles.footerButton]}
        >
          <AntDesign name='heart' size={30} color='#78ffd6' />
        </TouchableOpacity>
      </View>

      <FlatList
        contentContainerStyle={styles.flatList}
        data={[0]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ index }) => {
          const firstCard = index === 0;

          return (
            <Animated.View
              {...Pan.panHandlers}
              onLayout={(e) => {
                this.cardHeight = e.nativeEvent.layout.height;
                this.cardWidth = e.nativeEvent.layout.width;
              }}
              style={[
                styles.card,
                { backgroundColor: getRandomColor() },
                {position: 'relative',
                zIndex: 1,},
                firstCard && {
                  ...valueXY.getLayout(),
                  transform: [{ rotate: t }],
                  position: 'relative',
                  zIndex: 99,
                },
              ]}
            >
              <View ref={(node) => this.cardRef = node} style={{ width: '100%', height: '100%' }} />
              <Animated.Text
                style={{
                  position: 'absolute',
                  top: 40,
                  right: 30,
                  transform: [{ rotate: '7deg' }],
                  fontSize: 25,
                  fontWeight: 'bold',
                  padding: 10,
                  color: 'red',
                  borderWidth: 4,
                  borderColor: 'red',
                  opacity: nopeOpacity
                }}
              >
                NOPE
              </Animated.Text>
              <Animated.Text
                style={{
                  position: 'absolute',
                  top: 40,
                  left: 30,
                  transform: [{ rotate: '-7deg' }],
                  fontSize: 25,
                  fontWeight: 'bold',
                  padding: 10,
                  color: 'green',
                  borderWidth: 4,
                  borderColor: 'green',
                  opacity: likeOpacity
                }}
              >
                LIKE
              </Animated.Text>
            </Animated.View>
          )
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: Constants.statusBarHeight,
  },
  flatList: {
    position: 'relative',
    width,
    height,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  card: {
    // position: 'absolute',
    zIndex: 3,
    width: width - 20,
    height: height - 130,
    backgroundColor: 'black',
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  footer: {
    position: 'absolute',
    zIndex: 1,
    width,
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smButton: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  lgButton: {
    width: 60,
    height: 60,
    borderRadius: 60,
  },
  footerButton: {
    position: 'relative',
    zIndex: 2,
    backgroundColor: '#FFF',
    elevation: 5,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
