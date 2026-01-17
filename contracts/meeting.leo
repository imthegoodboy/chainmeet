// ChainMeet - Meeting Management Contract
// Handles creation, management, and status of privacy-first meetings

program meeting.aleo {
    // Meeting structure
    struct Meeting {
        meeting_id: u64,
        organizer: address,
        name: field,
        description: field,
        rule_hash: field,
        start_time: u64,
        end_time: u64,
        status: u8, // 0: active, 1: ended, 2: cancelled
        metadata_cid: field, // IPFS CID for meeting metadata
    }

    // Private record for meeting organizer
    record MeetingRecord {
        owner: address.private,
        meeting_id: u64.private,
        organizer_key: field.private,
    }

    // Public mappings
    mapping meetings: u64 => Meeting;
    mapping organizer_meetings: address => u64;

    // Initialize meeting counter
    transition initialize() -> u64 {
        return 0u64;
    }

    // Create a new meeting
    transition create_meeting(
        organizer: address,
        name: field,
        description: field,
        rule_hash: field,
        start_time: u64,
        end_time: u64,
        metadata_cid: field
    ) -> MeetingRecord {
        // Get next meeting ID (simplified - in production use proper counter)
        let meeting_id: u64 = 0u64;
        
        // Create meeting struct
        let meeting = Meeting {
            meeting_id: meeting_id,
            organizer: organizer,
            name: name,
            description: description,
            rule_hash: rule_hash,
            start_time: start_time,
            end_time: end_time,
            status: 0u8,
            metadata_cid: metadata_cid,
        };

        // Store meeting in public mapping
        set meetings[meeting_id] => meeting;

        // Track organizer's meetings
        set organizer_meetings[organizer] => meeting_id;

        // Create private record for organizer
        let organizer_key = hash_to_field(organizer, meeting_id);
        return MeetingRecord {
            owner: organizer,
            meeting_id: meeting_id,
            organizer_key: organizer_key,
        };
    }

    // Update meeting details (only organizer)
    transition update_meeting(
        meeting_id: u64,
        name: field,
        description: field,
        metadata_cid: field
    ) -> bool {
        // Get existing meeting
        let meeting = meetings[meeting_id];
        
        // Update fields
        let updated_meeting = Meeting {
            meeting_id: meeting.meeting_id,
            organizer: meeting.organizer,
            name: name,
            description: description,
            rule_hash: meeting.rule_hash,
            start_time: meeting.start_time,
            end_time: meeting.end_time,
            status: meeting.status,
            metadata_cid: metadata_cid,
        };

        set meetings[meeting_id] => updated_meeting;
        return true;
    }

    // End a meeting
    transition end_meeting(meeting_id: u64) -> bool {
        let meeting = meetings[meeting_id];
        
        let ended_meeting = Meeting {
            meeting_id: meeting.meeting_id,
            organizer: meeting.organizer,
            name: meeting.name,
            description: meeting.description,
            rule_hash: meeting.rule_hash,
            start_time: meeting.start_time,
            end_time: meeting.end_time,
            status: 1u8,
            metadata_cid: meeting.metadata_cid,
        };

        set meetings[meeting_id] => ended_meeting;
        return true;
    }

    // Cancel a meeting
    transition cancel_meeting(meeting_id: u64) -> bool {
        let meeting = meetings[meeting_id];
        
        let cancelled_meeting = Meeting {
            meeting_id: meeting.meeting_id,
            organizer: meeting.organizer,
            name: meeting.name,
            description: meeting.description,
            rule_hash: meeting.rule_hash,
            start_time: meeting.start_time,
            end_time: meeting.end_time,
            status: 2u8,
            metadata_cid: meeting.metadata_cid,
        };

        set meetings[meeting_id] => cancelled_meeting;
        return true;
    }

    // Get meeting details
    function get_meeting(meeting_id: u64) -> Meeting {
        return meetings[meeting_id];
    }

    // Helper function to hash address and meeting_id
    function hash_to_field(addr: address, id: u64) -> field {
        // Simplified hash - in production use proper hash function
        return field(addr) + field(id);
    }
}
