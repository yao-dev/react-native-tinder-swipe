import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Easing, LayoutAnimation, PanResponder, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';

const { width, height } = Dimensions.get('window');

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const getRandomColor = () => {
  const min = 50;
  const max = 255;
  const r = Math.floor(Math.random() * (max - min) + min);
  const g = Math.floor(Math.random() * (max - min) + min);
  const b = Math.floor(Math.random() * (max - min) + min);

  return `rgba(${r},${g},${b},1)`;
};

const cards = Array.from(Array(10).keys(), (value) => ({
  value,
  bg: getRandomColor()
}))

export default function App() {
  const [swipeCards, setSwipeCards] = useState(cards);
  const [swiping, setSwiping] = useState(false);
  const valueXY = new Animated.ValueXY();

  const Pan = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        valueXY.setValue({ x: 0, y: 0 })
        setSwiping(true)
      },
      onPanResponderMove: (evt, gestureState) => {
        valueXY.setValue({
          x: gestureState.dx,
          y: gestureState.dy,
        })
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        swipeOnRelease(gestureState)
      },
      onPanResponderTerminate: (evt, gestureState) => {
        swipeOnRelease(gestureState)
      },
      onShouldBlockNativeResponder: (evt, gestureState) => true,
  });

  const getXOnMove = (gestureState) => {
    const x = (gestureState.x0 - gestureState.moveX) * -1;
    return x;
  }

  const getYOnMove = (gestureState) => {
    const y = (gestureState.y0 - gestureState.moveY) * -1;
    return y;
  }

  const swipeOnRelease = (gestureState) => {
    const x = getXOnMove(gestureState);

    const shouldSwipeNext = Math.abs(x) > this.cardWidth / 3;

    if (!shouldSwipeNext) {
      return getCardBack(100)
    }

    // should dislike
    if (Math.sign(x) < 0) return dislike();

    // should like
    return like();
  }

  const removeFirstCard = () => {
    // setLastIndexRemoved(swipeCards[0])
    // setSwipeCards(swipeCards.slice(1))
  }

  const dislike = () => {
    this.lastPosition = -(width * 2)
    Animated.timing(valueXY.x, {
      toValue: -(width * 2),
      easing: Easing.ease,
      duration: 500,
    }).start(() => {
      removeFirstCard()
    });
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
    }).start(() => {
      removeFirstCard()
    });
  }

  useEffect(() => {
    console.log(swipeCards)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    Animated.timing(valueXY, {
      toValue: 0,
      easing: Easing.ease,
      duration: 2000,
    }).start();
    // valueXY.setValue({ x: 0, y: 0 })
  }, [swipeCards])

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

  const cardBehindWidth = valueXY.x.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [width - 20, width - 50, width - 20],
    extrapolate: 'clamp'
  });

  const cardBehindHeight = valueXY.x.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [height - 130, height - 160, height - 130],
    extrapolate: 'clamp'
  })

  const renderItem = (item, extraStyle = {}) => {
    if (!item) return;
    const isAbsolute = extraStyle.position === 'absolute';
    {/* PROFILE CARD */}
    return (
      <Animated.View
        {...Pan.panHandlers}
        onLayout={(e) => {
          this.cardHeight = e.nativeEvent.layout.height;
          this.cardWidth = e.nativeEvent.layout.width;
        }}
        style={[
          styles.card, {
            backgroundColor: item.bg,
            zIndex: 98,
            top: 0,
            left: 0,
            position: 'relative'
          },
          extraStyle
        ]}
      >
        <Text>{item.value}</Text>
        {/* NOPE TEXT */}
        {isAbsolute ? (
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
        ) : null }
        {/* LIKE TEXT */}
        {isAbsolute ? (
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
        ) : null }
      </Animated.View>
    )
  }

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

      <ScrollView
        contentContainerStyle={styles.flatList}
        scrollEnabled={false}
        renderItem={renderItem}
      >
        <View style={styles.cardContainer}>
          {renderItem(swipeCards[1], {
            width: cardBehindWidth,
            height: cardBehindHeight
          })}
          {renderItem(swipeCards[0], {
            position: 'absolute',
            zIndex: 99,
            ...valueXY.getLayout(),
            transform: [{ rotate: t }],
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight,
  },
  flatList: {
    position: 'relative',
    zIndex: 3,
    width,
    height,
  },
  cardContainer: {
    zIndex: 3,
    width: width,
    height: height - 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    zIndex: 3,
    width: width - 20,
    height: height - 130,
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
    shadowColor: 'black',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.2,
  }
});
