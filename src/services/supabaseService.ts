import { supabase } from '../supabase';
import { Match, Prediction, UserProfile, Withdrawal } from '../types';

export const supabaseService = {
  // Auth
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('uid', uid)
      .single();
    
    if (error) {
      console.error('Error fetching user profile from Supabase:', error);
      return null;
    }
    return data as UserProfile;
  },

  // Matches
  async getOpenMatches(): Promise<Match[]> {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('status', 'open');
    
    if (error) {
      console.error('Error fetching matches from Supabase:', error);
      return [];
    }
    return data as Match[];
  },

  async getAllMatches(): Promise<Match[]> {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching all matches from Supabase:', error);
      return [];
    }
    return data as Match[];
  },

  async createMatch(match: Omit<Match, 'id'>): Promise<boolean> {
    const { error } = await supabase
      .from('matches')
      .insert([{
        teamA: match.teamA,
        logoA: match.logoA,
        teamB: match.teamB,
        logoB: match.logoB,
        status: match.status,
        deadline: match.deadline,
        totalPrize: match.totalPrize,
        winnerCount: match.winnerCount,
        created_at: new Date().toISOString()
      }]);
    
    if (error) {
      console.error('Error creating match in Supabase:', error);
      return false;
    }
    return true;
  },

  async updateMatch(id: string, updates: Partial<Match>): Promise<boolean> {
    const { error } = await supabase
      .from('matches')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating match in Supabase:', error);
      return false;
    }
    return true;
  },

  // Predictions
  async getPredictions(userId: string): Promise<Prediction[]> {
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('userId', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching predictions from Supabase:', error);
      return [];
    }
    return data as Prediction[];
  },

  async getAllPredictions(): Promise<Prediction[]> {
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching all predictions from Supabase:', error);
      return [];
    }
    return data as Prediction[];
  },

  async getMatchPredictions(matchId: string): Promise<Prediction[]> {
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('matchId', matchId);
    
    if (error) {
      console.error('Error fetching match predictions from Supabase:', error);
      return [];
    }
    return data as Prediction[];
  },

  async createPrediction(prediction: Omit<Prediction, 'id'>): Promise<boolean> {
    const { error } = await supabase
      .from('predictions')
      .insert([{
        userId: prediction.userId,
        matchId: prediction.matchId,
        scoreA: prediction.scoreA,
        scoreB: prediction.scoreB,
        status: prediction.status,
        created_at: new Date().toISOString()
      }]);
    
    if (error) {
      console.error('Error creating prediction in Supabase:', error);
      return false;
    }
    return true;
  },

  async updatePrediction(id: string, updates: Partial<Prediction>): Promise<boolean> {
    const { error } = await supabase
      .from('predictions')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating prediction in Supabase:', error);
      return false;
    }
    return true;
  },

  // Withdrawals
  async getWithdrawals(userId: string): Promise<Withdrawal[]> {
    const { data, error } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('userId', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching withdrawals from Supabase:', error);
      return [];
    }
    return data as Withdrawal[];
  },

  async getAllWithdrawals(): Promise<Withdrawal[]> {
    const { data, error } = await supabase
      .from('withdrawals')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching all withdrawals from Supabase:', error);
      return [];
    }
    return data as Withdrawal[];
  },

  async createWithdrawal(withdrawal: Omit<Withdrawal, 'id'>): Promise<boolean> {
    const { error } = await supabase
      .from('withdrawals')
      .insert([{
        userId: withdrawal.userId,
        amount: withdrawal.amount,
        status: withdrawal.status,
        created_at: new Date().toISOString()
      }]);
    
    if (error) {
      console.error('Error creating withdrawal in Supabase:', error);
      return false;
    }
    return true;
  },

  async updateWithdrawal(id: string, updates: Partial<Withdrawal>): Promise<boolean> {
    const { error } = await supabase
      .from('withdrawals')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating withdrawal in Supabase:', error);
      return false;
    }
    return true;
  },

  // Users
  async getAllUsers(): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) {
      console.error('Error fetching all users from Supabase:', error);
      return [];
    }
    return data as UserProfile[];
  },

  async updateUserBalance(uid: string, balance: number): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .update({ balance })
      .eq('uid', uid);
    
    if (error) {
      console.error('Error updating user balance in Supabase:', error);
      return false;
    }
    return true;
  },

  // Settings
  async getConfig(): Promise<any | null> {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 'config')
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error('Error fetching config from Supabase:', error);
      return null;
    }
    return data;
  },

  async saveConfig(config: any): Promise<boolean> {
    const { error } = await supabase
      .from('settings')
      .upsert([{ id: 'config', ...config }]);
    
    if (error) {
      console.error('Error saving config to Supabase:', error);
      return false;
    }
    return true;
  }
};
