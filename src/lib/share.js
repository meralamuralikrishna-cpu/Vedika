import { v4 as uuid } from 'uuid';
import { supabase } from '@/lib/supabase';

const SHARE_FIELDS = 'id, design_id, name, elements, settings, venue_plan, created_at, status, comments, approved_at, approved_by';

function mapShare(row) {
  if (!row) return null;
  return {
    id: row.id,
    designId: row.design_id,
    name: row.name,
    elements: row.elements,
    settings: row.settings,
    venuePlan: row.venue_plan,
    createdAt: row.created_at,
    status: row.status,
    comments: row.comments ?? [],
    approvedAt: row.approved_at,
    approvedBy: row.approved_by,
  };
}

export async function getSharedDesign(id) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('shared_designs').select(SHARE_FIELDS).eq('id', id).maybeSingle();
  if (error) throw error;
  const share = mapShare(data);
  if (!share) return null;
  return share;
}

export async function getMySharedDesigns() {
  if (!supabase) return [];
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Sign in to manage share links.');
  const { data, error } = await supabase.from('shared_designs').select(`${SHARE_FIELDS}, owner_id`).eq('owner_id', user.id).order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapShare);
}

export async function updateSharedDesignContent(id, changes) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.from('shared_designs').update({
    name: changes.name,
    elements: changes.elements,
    settings: changes.settings,
    venue_plan: changes.venuePlan,
  }).eq('id', id).select(SHARE_FIELDS).maybeSingle();
  if (error) throw error;
  return mapShare(data);
}

export async function revokeSharedDesign(id) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { error } = await supabase.from('shared_designs').delete().eq('id', id);
  if (error) throw error;
}

export async function createSharedDesign(input) {
  if (!supabase) throw new Error('Connect Supabase to create a share link.');
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Sign in before creating a share link.');
  const { data, error } = await supabase.from('shared_designs').insert({
    id: uuid(),
    owner_id: user.id,
    design_id: input.designId,
    name: input.name,
    elements: input.elements,
    settings: input.settings,
    venue_plan: input.venuePlan,
    status: 'pending',
    comments: [],
  }).select(SHARE_FIELDS).single();
  if (error) throw error;
  return mapShare(data);
}

async function updateFeedback(id, changes) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('shared_designs').update(changes).eq('id', id).select(SHARE_FIELDS).maybeSingle();
  if (error) throw error;
  return mapShare(data);
}

export async function addShareComment(shareId, author, body) {
  const share = await getSharedDesign(shareId);
  if (!share) return null;
  const comment = { id: uuid(), author: author.trim() || 'Guest', body: body.trim(), createdAt: new Date().toISOString() };
  return updateFeedback(shareId, { comments: [...share.comments, comment] });
}

export async function setShareStatus(shareId, status, approvedBy) {
  const changes = { status };
  if (status === 'approved') {
    changes.approved_at = new Date().toISOString();
    changes.approved_by = approvedBy?.trim() || 'Family guest';
  }
  return updateFeedback(shareId, changes);
}

export function shareUrl(shareId) {
  return `${window.location.origin}/share/${shareId}`;
}

export function DEFAULT_VENUE_PLAN() {
  return { enabled: false, imageDataUrl: null, widthFt: 40, depthFt: 28, showGrid: true };
}
