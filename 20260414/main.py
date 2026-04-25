import streamlit as st
from pydub import AudioSegment
from pydub.generators import Sine, Square, Sawtooth, Triangle, WhiteNoise
import io

st.title("Pydub Audio Samples")

def generate_audio(generator_class, duration=1000, freq=440):
    """指定されたジェネレータで音声を生成する"""
    if generator_class == WhiteNoise:
        generator = generator_class()
    else:
        generator = generator_class(freq)
    
    audio = generator.to_audio_segment(duration=duration)
    return audio

# 音声の種類
wave_types = {
    "Sine Wave (サイン波)": Sine,
    "Square Wave (矩形波)": Square,
    "Sawtooth Wave (のこぎり波)": Sawtooth,
    "Triangle Wave (三角波)": Triangle,
    "White Noise (ホワイトノイズ)": WhiteNoise,
}

# 各音声の再生
for wave_name, generator_class in wave_types.items():
    st.header(wave_name)
    
    if generator_class != WhiteNoise:
        # スライダーで20Hzから5000Hzまで選べるようにする
        freq = st.slider(f"周波数 (Hz) - {wave_name}", min_value=20, max_value=5000, value=440, step=10, key=wave_name)
        audio_segment = generate_audio(generator_class, freq=freq)
    else:
        st.write("ホワイトノイズ自体はすべての周波数が均等に含まれている音ですが、**フィルター**を使って特定の音域（高音や低音）だけを残すことで「シャー」「サー」「ゴー」といった音に変化させることができます。")
        
        col1, col2 = st.columns(2)
        with col1:
            high_pass = st.slider("ハイパス (Hz) - 指定より低い音をカット", min_value=0, max_value=10000, value=0, step=100, key="high_pass")
        with col2:
            low_pass = st.slider("ローパス (Hz) - 指定より高い音をカット", min_value=100, max_value=20000, value=20000, step=100, key="low_pass")
            
        audio_segment = generate_audio(generator_class)
        
        # フィルターを適用する
        if high_pass > 0:
            audio_segment = audio_segment.high_pass_filter(high_pass)
        if low_pass < 20000:
            audio_segment = audio_segment.low_pass_filter(low_pass)

    # Streamlitで再生するためにBytesIOにエクスポート
    audio_bytes = io.BytesIO()
    audio_segment.export(audio_bytes, format="wav")
    audio_bytes.seek(0)
    
    st.audio(audio_bytes, format="audio/wav")
