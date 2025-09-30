'use client'

import { supabase } from './supabase-client'

// Helper to check for auth session missing error
const isAuthSessionMissing = (error: any) => {
  return error?.message === 'Auth session missing!'
}

// Auth & Profile Actions
export async function createProfile(userId: string, email: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email,
        role: 'intern'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating profile:', error)
      throw new Error('Failed to create profile')
    }

    return data
  } catch (error) {
    console.error('Error in createProfile:', error)
    throw error
  }
}

export async function getProfile(userId: string) {
  try {
    // Check if we have a session first
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Session error in getProfile:', sessionError)
      return null
    }
    
    if (!session) {
      console.log('No session in getProfile for user:', userId)
      return null
    }

    console.log('Session exists, fetching profile for:', userId)

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Supabase error details:', {
        error,
        errorKeys: Object.keys(error),
        errorString: JSON.stringify(error),
        userId,
        hasSession: !!session
      })
      return null
    }

    console.log('Profile fetched successfully:', data)
    return data
  } catch (error) {
    console.error('Exception in getProfile:', error)
    return null
  }
}

export async function updateProfileSemester(userId: string, semesterId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ semester_id: semesterId })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      if (isAuthSessionMissing(error)) {
        return null
      }
      console.error('Error updating profile semester:', error)
      throw new Error('Failed to update semester')
    }

    return data
  } catch (error) {
    console.error('Error in updateProfileSemester:', error)
    throw error
  }
}

export async function updateProfileName(userId: string, name: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ name })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      // Check if it's just an empty error object (sometimes happens with Supabase)
      const hasErrorDetails = error.message || error.details || error.hint
      
      if (!hasErrorDetails) {
        console.log('Empty error object received, but update might have succeeded')
        // Try to fetch the profile to verify the update worked
        const { data: verifyData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
        
        if (verifyData) {
          return verifyData
        }
      }
      
      if (isAuthSessionMissing(error)) {
        return null
      }
      
      console.error('Error updating profile name:', error)
      throw new Error('Failed to update name')
    }

    return data
  } catch (error) {
    console.error('Error in updateProfileName:', error)
    throw error
  }
}

// Observation Forms Actions
export async function createObservationForm(formData: {
  school: string
  grade: string
  duration: number
  class_comment: string
  semester_id: string
  author_id: string
}) {
  try {
    const { data, error } = await supabase
      .from('observation_forms')
      .insert(formData)
      .select()
      .single()

    if (error) {
      console.error('Error creating observation form:', error)
      throw new Error('Failed to create observation form')
    }

    return data
  } catch (error) {
    console.error('Error in createObservationForm:', error)
    throw error
  }
}

export async function createObservationEntries(formId: string, entries: Array<{
  time: string
  description: string
  comment: string
}>) {
  try {
    const entriesWithFormId = entries.map(entry => ({
      time_min: entry.time,
      happened: entry.description,
      comment: entry.comment,
      form_id: formId
    }))

    const { data, error } = await supabase
      .from('observation_entries')
      .insert(entriesWithFormId)
      .select()

    if (error) {
      console.error('Error creating observation entries:', error)
      throw new Error('Failed to create observation entries')
    }

    return data
  } catch (error) {
    console.error('Error in createObservationEntries:', error)
    throw error
  }
}

export async function getObservationForms(authorId: string) {
  try {
    const { data, error } = await supabase
      .from('observation_forms')
      .select(`
        *,
        observation_entries (*)
      `)
      .eq('author_id', authorId)
      .order('created_at', { ascending: false })

    if (error) {
      if (isAuthSessionMissing(error)) {
        return []
      }
      console.error('Error fetching observation forms:', error)
      return []
    }

    return data
  } catch (error) {
    console.error('Error in getObservationForms:', error)
    return []
  }
}

export async function getObservationForm(formId: string, authorId: string) {
  try {
    const { data, error } = await supabase
      .from('observation_forms')
      .select(`
        *,
        observation_entries (*)
      `)
      .eq('id', formId)
      .eq('author_id', authorId)
      .single()

    if (error) {
      if (isAuthSessionMissing(error)) {
        return null
      }
      console.error('Error fetching observation form:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getObservationForm:', error)
    return null
  }
}

export async function updateObservationForm(formId: string, authorId: string, updates: {
  school?: string
  grade?: string
  duration?: number
  class_comment?: string
}) {
  try {
    const { data, error } = await supabase
      .from('observation_forms')
      .update(updates)
      .eq('id', formId)
      .eq('author_id', authorId)
      .select()
      .single()

    if (error) {
      console.error('Error updating observation form:', error)
      throw new Error('Failed to update observation form')
    }

    return data
  } catch (error) {
    console.error('Error in updateObservationForm:', error)
    throw error
  }
}

export async function deleteObservationForm(formId: string, authorId: string) {
  try {
    // First delete all entries (cascade might not be set up)
    await supabase
      .from('observation_entries')
      .delete()
      .eq('form_id', formId)

    // Then delete the form
    const { error } = await supabase
      .from('observation_forms')
      .delete()
      .eq('id', formId)
      .eq('author_id', authorId)

    if (error) {
      console.error('Error deleting observation form:', error)
      throw new Error('Failed to delete observation form')
    }
  } catch (error) {
    console.error('Error in deleteObservationForm:', error)
    throw error
  }
}

export async function deleteObservationEntry(entryId: string, authorId: string) {
  try {
    // First get the form to verify ownership
    const { data: form } = await supabase
      .from('observation_entries')
      .select('form_id, observation_forms!inner(author_id)')
      .eq('id', entryId)
      .single()

    if (!form || (form.observation_forms as any).author_id !== authorId) {
      throw new Error('Unauthorized')
    }

    const { error } = await supabase
      .from('observation_entries')
      .delete()
      .eq('id', entryId)

    if (error) {
      console.error('Error deleting observation entry:', error)
      throw new Error('Failed to delete observation entry')
    }
  } catch (error) {
    console.error('Error in deleteObservationEntry:', error)
    throw error
  }
}

export async function updateObservationEntry(entryId: string, authorId: string, updates: {
  time?: string
  description?: string
  comment?: string
}) {
  try {
    // First get the form to verify ownership
    const { data: form } = await supabase
      .from('observation_entries')
      .select('form_id, observation_forms!inner(author_id)')
      .eq('id', entryId)
      .single()

    if (!form || (form.observation_forms as any).author_id !== authorId) {
      throw new Error('Unauthorized')
    }

    // Map to correct column names
    const dbUpdates: any = {}
    if (updates.time !== undefined) dbUpdates.time_min = updates.time
    if (updates.description !== undefined) dbUpdates.happened = updates.description
    if (updates.comment !== undefined) dbUpdates.comment = updates.comment

    const { data, error } = await supabase
      .from('observation_entries')
      .update(dbUpdates)
      .eq('id', entryId)
      .select()
      .single()

    if (error) {
      console.error('Error updating observation entry:', error)
      throw new Error('Failed to update observation entry')
    }

    return data
  } catch (error) {
    console.error('Error in updateObservationEntry:', error)
    throw error
  }
}

export async function addObservationEntry(formId: string, authorId: string, entry: {
  time: string
  description: string
  comment: string
}) {
  try {
    // First verify form ownership
    const { data: form } = await supabase
      .from('observation_forms')
      .select('id')
      .eq('id', formId)
      .eq('author_id', authorId)
      .single()

    if (!form) {
      throw new Error('Unauthorized')
    }

    const { data, error } = await supabase
      .from('observation_entries')
      .insert({
        time_min: entry.time,
        happened: entry.description,
        comment: entry.comment,
        form_id: formId
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding observation entry:', error)
      throw new Error('Failed to add observation entry')
    }

    return data
  } catch (error) {
    console.error('Error in addObservationEntry:', error)
    throw error
  }
}

// Journal Actions
export async function createJournalEntry(entryData: {
  author_id: string
  body: string
  mood: number
  effort: number
  shared_with_tutor: boolean
  semester_id: string
}) {
  try {
    console.log('Creating journal entry with data:', entryData)
    
    const { data, error } = await supabase
      .from('journal_entries')
      .insert(entryData)
      .select()
      .single()

    if (error) {
      console.error('Supabase error details:', {
        error,
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw new Error(`Failed to create journal entry: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Error in createJournalEntry:', error)
    throw error
  }
}

export async function getJournalEntries(authorId: string) {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('author_id', authorId)
      .order('entry_date', { ascending: false })

    if (error) {
      if (isAuthSessionMissing(error)) {
        return []
      }
      console.error('Error fetching journal entries:', error)
      return []
    }

    return data
  } catch (error) {
    console.error('Error in getJournalEntries:', error)
    return []
  }
}

export async function getJournalEntry(entryId: string, authorId: string) {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', entryId)
      .eq('author_id', authorId)
      .single()

    if (error) {
      if (isAuthSessionMissing(error)) {
        return null
      }
      console.error('Error fetching journal entry:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getJournalEntry:', error)
    return null
  }
}

export async function updateJournalEntry(entryId: string, authorId: string, updates: {
  body?: string
  mood?: number
  effort?: number
  shared_with_tutor?: boolean
}) {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .update(updates)
      .eq('id', entryId)
      .eq('author_id', authorId)
      .select()
      .single()

    if (error) {
      console.error('Error updating journal entry:', error)
      throw new Error('Failed to update journal entry')
    }

    return data
  } catch (error) {
    console.error('Error in updateJournalEntry:', error)
    throw error
  }
}

export async function deleteJournalEntry(entryId: string, authorId: string) {
  try {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', entryId)
      .eq('author_id', authorId)

    if (error) {
      console.error('Error deleting journal entry:', error)
      throw new Error('Failed to delete journal entry')
    }
  } catch (error) {
    console.error('Error in deleteJournalEntry:', error)
    throw error
  }
}

// Complete form submission
export async function submitObservationForm(formData: {
  school: string
  grade: string
  duration: number
  class_comment: string
  semester_id: string
  author_id: string
  entries: Array<{
    time: string
    description: string
    comment: string
  }>
}) {
  try {
    // Create the form
    const form = await createObservationForm({
      school: formData.school,
      grade: formData.grade,
      duration: formData.duration,
      class_comment: formData.class_comment,
      semester_id: formData.semester_id,
      author_id: formData.author_id
    })

    // Create the entries
    if (formData.entries.length > 0) {
      await createObservationEntries(form.id, formData.entries)
    }

          // Redirect wird in der Komponente gehandhabt
  } catch (error) {
    console.error('Error in submitObservationForm:', error)
    throw error
  }
}

export async function submitJournalEntry(entryData: {
  author_id: string
  body: string
  mood: number
  effort: number
  shared_with_tutor: boolean
  semester_id: string
}) {
  try {
    await createJournalEntry(entryData)
          // Redirect wird in der Komponente gehandhabt
  } catch (error) {
    console.error('Error in submitJournalEntry:', error)
    throw error
  }
}
