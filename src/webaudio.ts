const audioPages = new Set([
    // Web Audio
    "AnalyserNode",
    "AudioBuffer",
    "AudioBufferSourceNode",
    "AudioContext",
    "AudioContextOptions",
    "AudioDestinationNode",
    "AudioListener",
    "AudioNode",
    "AudioNodeOptions",
    "AudioParam",
    "AudioProcessingEvent",
    "AudioScheduledSourceNode",
    "AudioWorklet",
    "AudioWorkletGlobalScope",
    "AudioWorkletNode",
    "AudioWorkletProcessor",
    "BaseAudioContext",
    "BiquadFilterNode",
    "ChannelMergerNode",
    "ChannelSplitterNode",
    "ConstantSourceNode",
    "ConvolverNode",
    "DelayNode",
    "DynamicsCompressorNode",
    "GainNode",
    "IIRFilterNode",
    "MediaElementAudioSourceNode",
    "MediaStreamAudioDestinationNode",
    "MediaStreamAudioSourceNode",
    "OfflineAudioCompletionEvent",
    "OfflineAudioContext",
    "OscillatorNode",
    "PannerNode",
    "PeriodicWave",
    "WaveShaperNode",
    "StereoPannerNode"
]);

export function resolveWebAudioName(name: string) {
    if (audioPages.has(name)) {
        return `https://developer.mozilla.org/en-US/docs/Web/API/${name}`;
    }
}
