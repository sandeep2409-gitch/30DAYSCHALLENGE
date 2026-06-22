import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  AlertTriangle, 
  User, 
  CheckSquare, 
  MessageSquare, 
  Plus, 
  Trash2,
  ListTodo,
  Clock,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { TEAM_MEMBERS, PRIORITY_OPTIONS } from '../utils/mockData';

function CardModal({
  card,
  column,
  onClose,
  updateCard,
  deleteCard
}) {
  // Local edit states
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [priority, setPriority] = useState(card.priority);
  const [dueDate, setDueDate] = useState(card.dueDate || '');
  const [assignees, setAssignees] = useState(card.assignees || []);
  
  // Subtasks/Checklist states
  const [newSubtask, setNewSubtask] = useState('');
  
  // Comments states
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('Pandu'); // default author

  const saveChanges = (fields) => {
    const updated = {
      ...card,
      ...fields
    };
    updateCard(card.id, updated);
  };

  const handleTitleBlur = () => {
    if (title.trim() && title.trim() !== card.title) {
      saveChanges({ title: title.trim() });
    }
  };

  const handleDescBlur = () => {
    if (description !== card.description) {
      saveChanges({ description });
    }
  };

  // --- Checklist CRUD ---
  const toggleSubtask = (itemId) => {
    const updatedChecklist = card.checklist.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    saveChanges({ checklist: updatedChecklist });
  };

  const addSubtask = (e) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    
    const newItem = {
      id: `sub-${Date.now()}`,
      text: newSubtask.trim(),
      completed: false
    };
    
    const updatedChecklist = [...(card.checklist || []), newItem];
    saveChanges({ checklist: updatedChecklist });
    setNewSubtask('');
  };

  const deleteSubtask = (itemId) => {
    const updatedChecklist = card.checklist.filter(item => item.id !== itemId);
    saveChanges({ checklist: updatedChecklist });
  };

  // --- Assignee Toggles ---
  const toggleAssignee = (memberId) => {
    let updated;
    if (assignees.includes(memberId)) {
      updated = assignees.filter(id => id !== memberId);
    } else {
      updated = [...assignees, memberId];
    }
    setAssignees(updated);
    saveChanges({ assignees: updated });
  };

  // --- Comments CRUD ---
  const addComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: `c-${Date.now()}`,
      author: commentAuthor,
      text: commentText.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedComments = [...(card.comments || []), newComment];
    saveChanges({ comments: updatedComments });
    setCommentText('');
  };

  const deleteComment = (commentId) => {
    const updatedComments = card.comments.filter(c => c.id !== commentId);
    saveChanges({ comments: updatedComments });
  };

  // Progress stats
  const totalSubtasks = card.checklist?.length || 0;
  const completedSubtasks = card.checklist?.filter(item => item.completed).length || 0;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content glass-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(10, 15, 26, 0.92)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          color: 'var(--text-primary)'
        }}
      >
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(255,255,255,0.01)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
              <span>In Column:</span>
              <span style={{ color: column?.color || '#3b82f6', fontWeight: '600' }}>{column?.title}</span>
            </div>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              className="input-field"
              style={{
                background: 'transparent',
                border: '1px solid transparent',
                fontSize: '1.25rem',
                fontWeight: '700',
                padding: '2px 4px',
                width: '450px',
                fontFamily: 'var(--font-heading)',
                height: '32px'
              }}
              onFocus={(e) => {
                e.target.style.border = '1px solid var(--glass-border)';
                e.target.style.background = 'rgba(0,0,0,0.3)';
              }}
              onBlurCapture={(e) => {
                e.target.style.border = '1px solid transparent';
                e.target.style.background = 'transparent';
              }}
            />
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              padding: '6px',
              borderRadius: '50%',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Grid Body */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '65% 35%',
          flex: 1,
          minHeight: 0,
          overflowY: 'auto'
        }}>
          {/* Left Area (Details, Checklist, Comments) */}
          <div style={{
            padding: '1.5rem',
            borderRight: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem'
          }}>
            {/* Description */}
            <div>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                Description
              </h4>
              <textarea
                placeholder="Add a detailed description for this task..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleDescBlur}
                className="input-field"
                rows={4}
                style={{ 
                  resize: 'none', 
                  background: 'rgba(0,0,0,0.25)', 
                  borderColor: 'rgba(255,255,255,0.05)',
                  lineHeight: '1.5',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            {/* Checklist */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <CheckSquare size={16} color="#3b82f6" /> Checklist
                </h4>
                {totalSubtasks > 0 && (
                  <span style={{ fontSize: '0.75rem', color: progressPercent === 100 ? '#22c55e' : 'var(--text-secondary)', fontWeight: '600' }}>
                    {progressPercent}% Complete
                  </span>
                )}
              </div>

              {/* Progress bar */}
              {totalSubtasks > 0 && (
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '999px',
                  marginBottom: '1rem',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    background: progressPercent === 100 ? 'linear-gradient(90deg, #22c55e, #4ade80)' : 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                    borderRadius: '999px',
                    transition: 'width 0.3s ease',
                    boxShadow: progressPercent === 100 ? '0 0 10px rgba(34,197,94,0.4)' : '0 0 10px rgba(59,130,246,0.4)'
                  }} />
                </div>
              )}

              {/* Subtasks Listing */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {card.checklist?.map(item => (
                  <div 
                    key={item.id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '0.5rem',
                      borderRadius: '0.375rem',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.03)'
                    }}
                  >
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.85rem', cursor: 'pointer', flex: 1 }}>
                      <input 
                        type="checkbox" 
                        checked={item.completed} 
                        onChange={() => toggleSubtask(item.id)}
                        style={{ width: '15px', height: '15px', cursor: 'pointer' }}
                      />
                      <span style={{ 
                        textDecoration: item.completed ? 'line-through' : 'none',
                        color: item.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                        transition: 'color 0.2s'
                      }}>
                        {item.text}
                      </span>
                    </label>
                    <button
                      onClick={() => deleteSubtask(item.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Subtask Inline Form */}
              <form onSubmit={addSubtask} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Add a subtask..."
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  className="input-field"
                  style={{ height: '32px', fontSize: '0.8rem' }}
                />
                <button 
                  type="submit" 
                  className="btn btn-secondary"
                  style={{ padding: '0 0.75rem', height: '32px' }}
                >
                  Add
                </button>
              </form>
            </div>

            {/* Comments Section */}
            <div>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                <MessageSquare size={16} color="#a855f7" /> Comments ({card.comments?.length || 0})
              </h4>
              
              {/* Add Comment */}
              <form onSubmit={addComment} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <input
                    type="text"
                    placeholder="Add comment text..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="input-field"
                    style={{ fontSize: '0.8rem', height: '36px' }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Comment as:</span>
                    <select
                      value={commentAuthor}
                      onChange={(e) => setCommentAuthor(e.target.value)}
                      className="input-field"
                      style={{ width: '100px', height: '22px', fontSize: '0.7rem', padding: '0 4px', background: 'rgba(255,255,255,0.03)' }}
                    >
                      {TEAM_MEMBERS.map(m => (
                        <option key={m.id} value={m.name} style={{background: '#0f172a'}}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ height: '36px', padding: '0 1rem', fontSize: '0.8rem' }}
                >
                  Send
                </button>
              </form>

              {/* Comments Listing */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '200px', overflowY: 'auto' }}>
                {card.comments?.length === 0 ? (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No comments posted yet.</p>
                ) : (
                  card.comments?.map(c => {
                    const initials = c.author.split(' ').map(n=>n[0]).join('').toUpperCase();
                    const member = TEAM_MEMBERS.find(m => m.name === c.author);
                    const avatarColor = member ? member.avatarColor : '#64748b';
                    
                    return (
                      <div 
                        key={c.id}
                        style={{
                          display: 'flex',
                          gap: '0.75rem',
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          background: 'rgba(255,255,255,0.015)',
                          border: '1px solid rgba(255,255,255,0.03)',
                          position: 'relative'
                        }}
                      >
                        {/* Member Avatar */}
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: avatarColor,
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          flexShrink: 0
                        }}>
                          {initials}
                        </div>
                        
                        {/* Content */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2px' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{c.author}</span>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                              {new Date(c.timestamp).toLocaleDateString()} {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.4', wordBreak: 'break-word' }}>
                            {c.text}
                          </p>
                        </div>

                        {/* Action Delete */}
                        <button
                          onClick={() => deleteComment(c.id)}
                          style={{
                            position: 'absolute',
                            right: '0.5rem',
                            top: '0.5rem',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Side Settings Area (Priority, Due Date, Assignees, Actions) */}
          <div style={{
            padding: '1.5rem',
            background: 'rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            {/* Priority Select */}
            <div>
              <h5 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', tracking: '0.05em', marginBottom: '0.5rem' }}>
                Priority
              </h5>
              <select
                value={priority}
                onChange={(e) => {
                  setPriority(e.target.value);
                  saveChanges({ priority: e.target.value });
                }}
                className="input-field"
                style={{ fontSize: '0.8rem' }}
              >
                {PRIORITY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value} style={{background: '#0f172a'}}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date Input */}
            <div>
              <h5 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', tracking: '0.05em', marginBottom: '0.5rem' }}>
                Due Date
              </h5>
              <div style={{ position: 'relative' }}>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => {
                    setDueDate(e.target.value);
                    saveChanges({ dueDate: e.target.value });
                  }}
                  className="input-field"
                  style={{ fontSize: '0.8rem', paddingLeft: '2.25rem' }}
                />
                <Calendar size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>

            {/* Assignees Checkboxes */}
            <div>
              <h5 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', tracking: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <UserPlus size={14} /> Assign Members
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {TEAM_MEMBERS.map(member => {
                  const isAssigned = assignees.includes(member.id);
                  return (
                    <button
                      key={member.id}
                      onClick={() => toggleAssignee(member.id)}
                      style={{
                        background: isAssigned ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                        border: '1px solid',
                        borderColor: isAssigned ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                        padding: '0.375rem 0.5rem',
                        borderRadius: '0.375rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        color: isAssigned ? '#fff' : 'var(--text-secondary)',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isAssigned) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isAssigned) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span style={{ 
                        width: '18px', 
                        height: '18px', 
                        borderRadius: '50%', 
                        backgroundColor: member.avatarColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.6rem',
                        fontWeight: '600',
                        color: '#fff'
                      }}>
                        {member.initials}
                      </span>
                      <span style={{ fontSize: '0.8rem', flex: 1 }}>{member.name}</span>
                      {isAssigned && (
                        <span style={{ fontSize: '0.65rem', background: '#3b82f6', color: '#fff', padding: '1px 5px', borderRadius: '4px', fontWeight: '500' }}>Active</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Delete Card Trigger */}
            <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <button
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete this card?`)) {
                    deleteCard(column.id, card.id);
                  }
                }}
                className="btn btn-danger"
                style={{ width: '100%', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}
              >
                <Trash2 size={14} /> Delete Card
              </button>
            </div>

            {/* Local Card History Log */}
            <div>
              <h5 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', tracking: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={12} /> Card History
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', maxHeight: '100px', overflowY: 'auto', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {card.activity?.map((act, i) => (
                  <div key={act.id || i} style={{ display: 'flex', gap: '0.25rem', alignItems: 'flex-start' }}>
                    <ChevronRight size={10} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <span>{act.text}</span>
                      <span style={{ display: 'block', fontSize: '0.6rem', opacity: 0.6 }}>
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardModal;
