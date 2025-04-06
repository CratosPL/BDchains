"use client";

import { useReducer } from "react";
import { motion } from "framer-motion";
import { FaTrash, FaEdit, FaCheck, FaTimes, FaSpinner } from "react-icons/fa";
import { addBandMember, updateBandMember, deleteBandMember } from "../../services/bandService";
import { Band, Member } from "../../types/bandTypes";
import { InputField } from "./InputField";

interface MembersTabProps {
  band: Band;
  bech32Address: string | undefined;
  members: Member[];
  pastMembers: Member[];
  onAddMember: (newMember: Member, isCurrent: boolean) => void;
  onUpdateMember: (updatedMember: Member) => void;
  onDeleteMember: (memberId: string) => void;
}

interface State {
  newMember: { name: string; role: string; status: "current" | "past" };
  editMember: { id: string | null; name: string; role: string; status: "current" | "past" };
  processing: { isProcessing: boolean; deletingMemberId: string | null; editingMemberId: string | null };
}

const initialState: State = {
  newMember: { name: "", role: "", status: "current" },
  editMember: { id: null, name: "", role: "", status: "current" },
  processing: { isProcessing: false, deletingMemberId: null, editingMemberId: null },
};

const reducer = (state: State, action: any): State => {
  switch (action.type) {
    case "SET_NEW_MEMBER":
      return { ...state, newMember: { ...state.newMember, ...action.payload } };
    case "SET_EDIT_MEMBER":
      return { ...state, editMember: { ...state.editMember, ...action.payload } };
    case "SET_PROCESSING":
      return { ...state, processing: { ...state.processing, ...action.payload } };
    default:
      return state;
  }
};

export const MembersTab = ({
  band,
  bech32Address,
  members,
  pastMembers,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
}: MembersTabProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.newMember.name || !state.newMember.role || !bech32Address) return;
    dispatch({ type: "SET_PROCESSING", payload: { isProcessing: true } });
    try {
      const newMember = await addBandMember(
        band.id,
        state.newMember.name,
        state.newMember.role,
        bech32Address,
        state.newMember.status === "current"
      );
      onAddMember(newMember, state.newMember.status === "current");
      dispatch({ type: "SET_NEW_MEMBER", payload: { name: "", role: "", status: "current" } });
    } catch (error) {
      console.error("Error adding member:", error);
    } finally {
      dispatch({ type: "SET_PROCESSING", payload: { isProcessing: false } });
    }
  };

  const handleEditMember = (member: Member) => {
    dispatch({
      type: "SET_EDIT_MEMBER",
      payload: { id: member.id, name: member.name, role: member.role, status: member.is_current ? "current" : "past" },
    });
  };

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.editMember.id || !state.editMember.name || !state.editMember.role || !bech32Address) return;
    dispatch({ type: "SET_PROCESSING", payload: { editingMemberId: state.editMember.id } });
    try {
      const updatedMember = await updateBandMember(
        state.editMember.id,
        state.editMember.name,
        state.editMember.role,
        state.editMember.status === "current"
      );
      onUpdateMember(updatedMember);
      dispatch({ type: "SET_EDIT_MEMBER", payload: { id: null, name: "", role: "", status: "current" } });
    } catch (error) {
      console.error("Error updating member:", error);
    } finally {
      dispatch({ type: "SET_PROCESSING", payload: { editingMemberId: null } });
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    dispatch({ type: "SET_PROCESSING", payload: { deletingMemberId: memberId } });
    try {
      await deleteBandMember(memberId);
      onDeleteMember(memberId);
    } catch (error) {
      console.error("Error deleting member:", error);
    } finally {
      dispatch({ type: "SET_PROCESSING", payload: { deletingMemberId: null } });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <form onSubmit={handleAddMember} className="space-y-4">
        <InputField
          label="Member Name"
          value={state.newMember.name}
          onChange={(e) => dispatch({ type: "SET_NEW_MEMBER", payload: { name: e.target.value } })}
          placeholder="Enter member name"
        />
        <InputField
          label="Role"
          value={state.newMember.role}
          onChange={(e) => dispatch({ type: "SET_NEW_MEMBER", payload: { role: e.target.value } })}
          placeholder="Enter role"
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <label className="text-[#8a8a8a]">
            <strong>Status:</strong>
          </label>
          <select
            value={state.newMember.status}
            onChange={(e) => dispatch({ type: "SET_NEW_MEMBER", payload: { status: e.target.value as "current" | "past" } })}
            className="w-full p-2 bg-[#2a2a2a] text-[#b0b0b0] border border-[#3a1c1c] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a4a4a]"
          >
            <option value="current">Current Member</option>
            <option value="past">Past Member</option>
          </select>
        </motion.div>
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] text-[#d0d0d0] rounded-lg hover:from-[#5a2e2e] hover:to-[#2a2a2a] hover:scale-105 transition-all duration-300 ease-in-out shadow-metal flex items-center gap-2"
          disabled={state.processing.isProcessing}
        >
          {state.processing.isProcessing ? <FaSpinner className="animate-spin" /> : "Add Member"}
        </button>
      </form>

      <div className="space-y-6">
        {/* Sekcja Current Members */}
        <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] p-4 rounded-lg shadow-metal border border-[#3a1c1c]">
          <h3
            className="text-lg font-unbounded text-[#d0d0d0] mb-3"
            style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
          >
            Current Members
          </h3>
          {members.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {members.map((member) => (
                <motion.div
                  key={member.id}
                  className="bg-[#1a1a1a] p-3 rounded-lg border border-[#3a1c1c] shadow-metal hover:bg-[#2a2a2a] hover:scale-[1.02] transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      {state.editMember.id === member.id ? (
                        <form onSubmit={handleUpdateMember} className="flex flex-col w-full space-y-2">
                          <InputField
                            value={state.editMember.name}
                            onChange={(e) => dispatch({ type: "SET_EDIT_MEMBER", payload: { name: e.target.value } })}
                            placeholder="Member name"
                          />
                          <InputField
                            value={state.editMember.role}
                            onChange={(e) => dispatch({ type: "SET_EDIT_MEMBER", payload: { role: e.target.value } })}
                            placeholder="Role"
                          />
                          <select
                            value={state.editMember.status}
                            onChange={(e) =>
                              dispatch({ type: "SET_EDIT_MEMBER", payload: { status: e.target.value as "current" | "past" } })
                            }
                            className="p-2 bg-[#2a2a2a] text-[#b0b0b0] border border-[#3a1c1c] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a4a4a]"
                          >
                            <option value="current">Current Member</option>
                            <option value="past">Past Member</option>
                          </select>
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className="text-[#8a4a4a] hover:text-[#d0d0d0] transition duration-300"
                              disabled={state.processing.editingMemberId === member.id}
                            >
                              {state.processing.editingMemberId === member.id ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                            </button>
                            <button
                              type="button"
                              onClick={() => dispatch({ type: "SET_EDIT_MEMBER", payload: { id: null } })}
                              className="text-[#8a4a4a] hover:text-[#d0d0d0] transition duration-300"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <p className="text-[#d0d0d0] font-unbounded">{member.name}</p>
                          <p className="text-[#8a8a8a] text-sm">{member.role}</p>
                        </>
                      )}
                    </div>
                    {state.editMember.id !== member.id && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditMember(member)}
                          className="text-[#8a4a4a] hover:text-[#d0d0d0] transition duration-300 flex items-center"
                          disabled={state.processing.editingMemberId === member.id}
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          className="text-[#8a4a4a] hover:text-[#d0d0d0] transition duration-300 flex items-center"
                          disabled={state.processing.deletingMemberId === member.id}
                        >
                          {state.processing.deletingMemberId === member.id ? <FaSpinner className="animate-spin" /> : <FaTrash size={16} />}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-[#8a8a8a] italic">No current members added yet.</p>
          )}
        </div>

        {/* Sekcja Past Members */}
        <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] p-4 rounded-lg shadow-metal border border-[#3a1c1c]">
          <h3
            className="text-lg font-unbounded text-[#d0d0d0] mb-3"
            style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
          >
            Past Members
          </h3>
          {pastMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pastMembers.map((member) => (
                <motion.div
                  key={member.id}
                  className="bg-[#1a1a1a] p-3 rounded-lg border border-[#3a1c1c] shadow-metal hover:bg-[#2a2a2a] hover:scale-[1.02] transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      {state.editMember.id === member.id ? (
                        <form onSubmit={handleUpdateMember} className="flex flex-col w-full space-y-2">
                          <InputField
                            value={state.editMember.name}
                            onChange={(e) => dispatch({ type: "SET_EDIT_MEMBER", payload: { name: e.target.value } })}
                            placeholder="Member name"
                          />
                          <InputField
                            value={state.editMember.role}
                            onChange={(e) => dispatch({ type: "SET_EDIT_MEMBER", payload: { role: e.target.value } })}
                            placeholder="Role"
                          />
                          <select
                            value={state.editMember.status}
                            onChange={(e) =>
                              dispatch({ type: "SET_EDIT_MEMBER", payload: { status: e.target.value as "current" | "past" } })
                            }
                            className="p-2 bg-[#2a2a2a] text-[#b0b0b0] border border-[#3a1c1c] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a4a4a]"
                          >
                            <option value="current">Current Member</option>
                            <option value="past">Past Member</option>
                          </select>
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className="text-[#8a4a4a] hover:text-[#d0d0d0] transition duration-300"
                              disabled={state.processing.editingMemberId === member.id}
                            >
                              {state.processing.editingMemberId === member.id ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                            </button>
                            <button
                              type="button"
                              onClick={() => dispatch({ type: "SET_EDIT_MEMBER", payload: { id: null } })}
                              className="text-[#8a4a4a] hover:text-[#d0d0d0] transition duration-300"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <p className="text-[#d0d0d0] font-unbounded">{member.name}</p>
                          <p className="text-[#8a8a8a] text-sm">{member.role}</p>
                        </>
                      )}
                    </div>
                    {state.editMember.id !== member.id && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditMember(member)}
                          className="text-[#8a4a4a] hover:text-[#d0d0d0] transition duration-300 flex items-center"
                          disabled={state.processing.editingMemberId === member.id}
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          className="text-[#8a4a4a] hover:text-[#d0d0d0] transition duration-300 flex items-center"
                          disabled={state.processing.deletingMemberId === member.id}
                        >
                          {state.processing.deletingMemberId === member.id ? <FaSpinner className="animate-spin" /> : <FaTrash size={16} />}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-[#8a8a8a] italic">No past members added yet.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};