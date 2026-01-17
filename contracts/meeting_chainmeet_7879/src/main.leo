// ChainMeet - Meeting Management Contract
// Handles creation, management, and status of privacy-first meetings

program meeting_chainmeet_7879.aleo {
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
        owner: address,
        meeting_id: u64,
        organizer_key: field,
    }

    // Public mappings
    mapping meetings: u64 => Meeting;
    mapping organizer_meetings: address => u64;
    mapping meeting_counter: u8 => u64; // Use u8 as key for singleton counter

    // Constructor - required for deployment (non-upgradable)
    @noupgrade
    async constructor() {}

    // Create a new meeting (entry point)
    async transition create_meeting(
        organizer: address,
        name: field,
        description: field,
        rule_hash: field,
        start_time: u64,
        end_time: u64,
        metadata_cid: field
    ) -> Future {
        return create_meeting_onchain(
            organizer,
            name,
            description,
            rule_hash,
            start_time,
            end_time,
            metadata_cid,
        );
    }

    // On-chain create meeting logic with mapping updates
    async function create_meeting_onchain(
        organizer: address,
        name: field,
        description: field,
        rule_hash: field,
        start_time: u64,
        end_time: u64,
        metadata_cid: field
    ) {
        // Get and increment meeting counter
        let current_counter = Mapping::get_or_use(meeting_counter, 0u8, 0u64);
        let meeting_id: u64 = current_counter + 1u64;
        Mapping::set(meeting_counter, 0u8, meeting_id);

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

        Mapping::set(meetings, meeting_id, meeting);
        Mapping::set(organizer_meetings, organizer, meeting_id);
    }

    // Update meeting details (entry point)
    async transition update_meeting(
        meeting_id: u64,
        name: field,
        description: field,
        metadata_cid: field
    ) -> Future {
        return update_meeting_onchain(meeting_id, name, description, metadata_cid);
    }

    // On-chain update logic
    async function update_meeting_onchain(
        meeting_id: u64,
        name: field,
        description: field,
        metadata_cid: field
    ) {
        // Meeting must exist - use get (will fail if doesn't exist, which is correct)
        let meeting = Mapping::get(meetings, meeting_id);

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

        Mapping::set(meetings, meeting_id, updated_meeting);
    }

    // End a meeting (entry point)
    async transition end_meeting(meeting_id: u64) -> Future {
        return end_meeting_onchain(meeting_id);
    }

    // On-chain end meeting logic
    async function end_meeting_onchain(meeting_id: u64) {
        // Meeting must exist - use get
        let meeting = Mapping::get(meetings, meeting_id);

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

        Mapping::set(meetings, meeting_id, ended_meeting);
    }

    // Cancel a meeting (entry point)
    async transition cancel_meeting(meeting_id: u64) -> Future {
        return cancel_meeting_onchain(meeting_id);
    }

    // On-chain cancel meeting logic
    async function cancel_meeting_onchain(meeting_id: u64) {
        // Meeting must exist - use get
        let meeting = Mapping::get(meetings, meeting_id);

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

        Mapping::set(meetings, meeting_id, cancelled_meeting);
    }

    // Helper function to hash address and meeting_id
    function hash_to_field(addr: address, id: u64) -> field {
        return 0field;
    }
}
