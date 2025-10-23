const assetsBase = "https://tomcollinsresearch.net/audio/aisc2023/vrtgo/"
const imgColorSnd = {
  "v": {
    "img": assetsBase + "assets/letter_v.png",
    "color": "#ac49d0", // Light purple
    "snd": assetsBase + "ver0/drums/drums_1.wav"
  },
  "o": {
    "img": assetsBase + "assets/letter_o.png",
    "color": "#DAA89B", // Melon
    "snd": assetsBase + "ver0/other/other_1.wav"
  }
}
const cubesArr = []


function chain_load(obj, idx, all){
  const keys = Object.keys(obj)
  if (idx === keys.length){
    return
  }
  const k = keys[idx]
  console.log(obj[k]["snd"])
  all.add(
    k, obj[k]["snd"],
    function(){
      // Make a new MusicCube.
      // Define location.
      const x = 4*Math.random()
      const y = 4*Math.random()
      const z = 4*Math.random()

      cubesArr[idx] = new MusicCube(
        k, { "x": x, "y": y, "z": z },
        obj[k]["img"],
        obj[k]["color"],
        all.get(k)
      )
      chain_load(obj, idx + 1, all)
    },
    function(){
      console.log("Error loading " + k)
      chain_load(obj, idx + 1, all)
    }
  )
}
const someBuff = new Tone.Buffers()
chain_load(imgColorSnd, 0, someBuff)

console.log("someBuff", someBuff)

let gameState

let camPos, camRot
const vrXMin = -150, vrXMax = 150,
vrYMin = -150, vrYMax = 150,
vrZMin = -150, vrZMax = 150

let printStateIdx = 0
const printStates = [
  "p1", "p2",
  // "debug",
  "off"
]
const deskModulo = 20
let deskTicker = 0


//Register
AFRAME.registerComponent('clickhandler', {

  init: function(){
    // var data = this.data
    // var el = this.el
    // el.addEventListener('click', function(){
    //   console.log("clicked: " + data.txt)
    // })

  }
})


AFRAME.registerComponent('ticker', {

  init: function(){
    this.cam = document.getElementById("theCamera")
    // this.cam.object3D.position.x = -35
    // this.cam.object3D.position.y = 5.6
    // this.cam.object3D.position.z = -10
    this.cam.object3D.rotation.y = 0
    // console.log("this.cam.object3D.rotation:", this.cam.object3D.rotation)

    // this.sphere = document.getElementById("sphere")
    // this.cylinder = document.getElementById("cylinder")
    // this.box = document.getElementById("box")

    this.camText = document.getElementById("camText")

    this.controllerData = document.querySelector("#controller-data").components["controller-listener"];
  },

  tick: function(){
    deskTicker = (deskTicker + 1) % deskModulo
    if (true){
      camPos = this.cam.object3D.position
      camRot = this.cam.object3D.rotation
      if (gameState === undefined){
        gameState = new GameState(cubesArr)
      }
      // console.log("gameState:", gameState)
      if (gameState !== undefined){

        gameState.gamePlayer.posXYZ.x = camPos.x
        gameState.gamePlayer.posXYZ.y = camPos.y
        gameState.gamePlayer.posXYZ.z = camPos.z
        gameState.gamePlayer.listener.positionX.value = map(
          camPos.x, vrXMin, vrXMax, -1, 1
        )
        gameState.gamePlayer.listener.positionY.value = map(
          camPos.y, vrYMin, vrYMax, -1, 1
        )
        gameState.gamePlayer.listener.positionZ.value = map(
          camPos.z, vrZMin, vrZMax, -1, 1
        )

        gameState.gamePlayer.listener.set({ "forwardZ": -cos(camRot.y) })

      }

      // let spherePos = this.sphere.object3D.position
      // distanceToSphere = parseInt(camPos.distanceTo(spherePos))
      // sphereAngle = calculateAngle(
      //   spherePos.x, camPos.x, spherePos.y, camPos.y
      // )

      // let cylinderPos = this.cylinder.object3D.position
      // distanceToCylinder = parseInt(
      //   camPos.distanceTo(cylinderPos)
      // )
      // cylinderAngle = calculateAngle(
      //   cylinderPos.x, camPos.x, cylinderPos.y, camPos.y
      // )
      // let boxPos = this.box.object3D.position
      // distanceToBox = parseInt(camPos.distanceTo(boxPos))
      // boxAngle = calculateAngle(
      //   boxPos.x, camPos.x, boxPos.y, camPos.y
      // )

      const camStr = `Camera x: ${Math.round(1000*camPos.x)/1000}
      Camera z: ${Math.round(1000*camPos.z)/1000}
      Tone.Listener x: ${Math.round(1000*gameState.gamePlayer.listener.positionX.value)/1000}
      Tone.Listener z: ${Math.round(1000*gameState.gamePlayer.listener.positionZ.value)/1000}
      Transport bpm: ${Math.round(1000*Tone.Transport.bpm.value)/1000}
      `

      // this.camText.setAttribute('value', camStr);

    }








  }
})


AFRAME.registerComponent('button-controls', {

 	init: function()
	{
		this.controllerData = document.querySelector("#controller-data").components["controller-listener"];
    this.cam = document.getElementById("theCamera");
    this.text = "";
	},

  tick: function()
	{

    if (this.controllerData.buttonA.pressed == true){
      my_play_pause()
    }
    if (this.controllerData.buttonB.pressed == true){
      my_stop()
    }

    if (this.controllerData.buttonX.pressed == true){
      printStateIdx = (printStateIdx + 1) % printStates.length
      if (printStates[printStateIdx] === "off"){
        this.el.style.display = "none"
      }
      else {
        this.el.style.display = "block"
      }
    }


	},

})


AFRAME.registerComponent('text-display', {

	init: function()
	{
		this.controllerData = document.querySelector("#controller-data").components["controller-listener"]
		this.text = ""
    console.log("this:", this)
	},

	tick: function()
	{
    // const pm = document.getElementById("player-move")
    // console.log("this.controllerData:", this.controllerData)
    // const cp2 = pm.get_xyz()

    if (printStates[printStateIdx] === "off"){
      this.el.setAttribute("visible", false)
      return
    }
    else {
      this.el.setAttribute("visible", true)
    }

    if (printStateIdx === 0){
      this.text = "Here's a simple A-Frame and Tone.js Web XR experience.\n" +
        "Press i to read more."
    }
    else if (printStateIdx === 1){
      this.text = "Bye!"
    }

    else if (printStates[printStateIdx] === "debug"){
      this.text = "Tone.Transport.bpm.value: " +
         Math.round(100*Tone.Transport.bpm.value)/100 + "\n" +
         "----------------------------------- \n" +
         "Left Controller:" + "\n" +
         "Joystick X: " + this.controllerData.leftAxisX + "\n" +
         "Joystick Y: " + this.controllerData.leftAxisY + "\n" +
         "[Y] Button: " + this.controllerData.buttonY.pressing + "\n" +
         "[X] Button: " + this.controllerData.buttonX.pressing + "\n" +
         "   Trigger: " + this.controllerData.leftTrigger.pressing + "\n" +
         "      Grip: " + this.controllerData.leftGrip.pressing + "\n" +
         "----------------------------------- \n" +
         "Right Controller:" + "\n" +
         "Joystick X: " + this.controllerData.rightAxisX + "\n" +
         "Joystick Y: " + this.controllerData.rightAxisY + "\n" +
         "[B] Button: " + this.controllerData.buttonB.pressing + "\n" +
         "[A] Button: " + this.controllerData.buttonA.pressing + "\n" +
         "   Trigger: " + this.controllerData.rightTrigger.pressing + "\n" +
         "      Grip: " + this.controllerData.rightGrip.pressing + "\n";
    }
		this.el.setAttribute("text", "value", this.text)
	}
})


function setup(){
  noCanvas()
}

function keyPressed(){
  if (key === "p"){
    my_play_pause()
  }
  if (key === "o"){
    my_stop()
  }
  if (key === "i"){
    printStateIdx = (printStateIdx + 1) % printStates.length
  }
}


function my_play_pause(){
  if (Tone.context !== "running"){
    Tone.start()
  }
  gameState.play_pause()
}

function my_stop(){
  gameState.stop()
  Tone.Transport.stop()
}


class GameState {
  constructor(_cubes){
    this.gamePlayer = new GamePlayer()
    // Initialization of SongSources
    this.cubes = _cubes
  }


  play_pause(){
    if (Tone.Transport.state === "started"){
      // Pause it!
      this.stop()
      Tone.Transport.pause()
    }
    else {
      console.log("Tone.Transport.seconds after:", Tone.Transport.seconds)
      // Start it!
      this.start()
      Tone.Transport.start(
        Tone.now() + 0.1
      )
    }
  }


  start(){
    // Hack the gains!
    this.cubes.forEach(function(s){
      s.start()
    })
  }


  stop(){
    // Hack the gains!
    this.cubes.forEach(function(s){
      s.stop()
    })
  }
}


class GamePlayer {
  constructor(_v){
    this.posXYZ = createVector(camPos.x, camPos.y, camPos.z)
    this.v = _v
    // Associate the Tone Listener with the GamePlayer.
    this.listener = Tone.Listener
    console.log("listener forwardZ:", this.listener.get().forwardZ)
  }
}


class MusicCube {
  constructor(
    _name, _xyz, _letterImg, _colour, _buff
  ){
    const self = this
    self.posXYZ = createVector(_xyz["x"], _xyz["y"], _xyz["z"])
    self.player = new Tone.GrainPlayer(
      _buff,
    )
    self.player.volume.value = 5
    // console.log("self.player.volume.value:", self.player.volume.value)
    Tone.Transport.schedule(function(time){
      self.player.start()
    }, "0:0:0")
    self.panner = new Tone.Panner3D({
      panningModel: "HRTF",
      positionX: map(_xyz["x"], vrXMin, vrXMax, -1, 1),
      positionY: map(_xyz["y"], vrYMin, vrYMax, -1, 1),
      positionZ: map(_xyz["z"], vrZMin, vrZMax, -1, 1),
    })
    self.gain = new Tone.Gain()
    self.playbackGain = new Tone.Gain().toDestination()
    self.player.chain(self.panner, self.gain, self.playbackGain)

    // Make the box.
    const scene = document.getElementById("scene")
    self.cube = document.createElement("a-box")
    self.cube.setAttribute("id", _name)
    self.cube.setAttribute(
      "position",
      _xyz["x"] + " " + _xyz["y"] + " " + _xyz["z"]
    )
    self.cube.setAttribute(
      "rotation",
      "0 " + Math.floor(360*Math.random()) + " 0"
    )
    self.cube.setAttribute("color", _colour)
    self.cube.setAttribute("src", _letterImg)
    self.cube.setAttribute("opacity", 0.5)
    // self.cube.setAttribute("transparent", true)
    self.cube.setAttribute("scale", "3 3 3")
    scene.appendChild(self.cube)

    // This helps to prevent errors when a player is static.
    gameState.update_tempo()
  }


  set_gain(newGain){
    this.gain.gain.rampTo(newGain, 5)
  }


  start(){
    this.playbackGain.gain.value = 0
    this.playbackGain.gain.rampTo(1, 0.5, "+0.1")
  }


  stop(){
    if (this.player.state === "started"){
      this.playbackGain.gain.rampTo(0, 0.5)
      this.player.stop("+0.5")
    }
  }
}
