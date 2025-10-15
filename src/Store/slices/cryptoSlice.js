import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCryptos = createAsyncThunk('crypto/fetchCryptos', async () => {
  const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
  return await response.json();
});

export const fetchCryptoHistory = createAsyncThunk('crypto/fetchCryptoHistory', async (coinId) => {
  const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30`)
  return { coinId, data: await response.json() };
});

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState: {
    cryptos: [],
    cryptoHistory: {},
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCryptos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cryptos = action.payload;
      })
      .addCase(fetchCryptos.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchCryptoHistory.fulfilled, (state, action) => {
        const { coinId, data } = action.payload;
        state.cryptoHistory[coinId] = data;
      });
  },
});

export default cryptoSlice.reducer;