#!/bin/bash

# Script to create proper Leo project structure
# Run this in WSL: bash create_leo_structure.sh

set -e

echo "🔧 Creating Leo project structure..."

# Get random numbers for unique program names
RAND1=$((RANDOM % 9000 + 1000))
RAND2=$((RANDOM % 9000 + 1000))
RAND3=$((RANDOM % 9000 + 1000))

MEETING_NAME="meeting_chainmeet_${RAND1}"
ELIGIBILITY_NAME="eligibility_chainmeet_${RAND2}"
ATTENDANCE_NAME="attendance_chainmeet_${RAND3}"

echo "📦 Meeting contract: $MEETING_NAME"
echo "📦 Eligibility contract: $ELIGIBILITY_NAME"
echo "📦 Attendance contract: $ATTENDANCE_NAME"

# Create directories
mkdir -p ${MEETING_NAME}/src
mkdir -p ${ELIGIBILITY_NAME}/src
mkdir -p ${ATTENDANCE_NAME}/src

# Create program.json files
cat > ${MEETING_NAME}/program.json << EOF
{
  "program": "${MEETING_NAME}.aleo",
  "version": "1.0.0",
  "description": "ChainMeet Meeting Management",
  "license": "MIT",
  "dependencies": {}
}
EOF

cat > ${ELIGIBILITY_NAME}/program.json << EOF
{
  "program": "${ELIGIBILITY_NAME}.aleo",
  "version": "1.0.0",
  "description": "ChainMeet Eligibility Verification",
  "license": "MIT",
  "dependencies": {}
}
EOF

cat > ${ATTENDANCE_NAME}/program.json << EOF
{
  "program": "${ATTENDANCE_NAME}.aleo",
  "version": "1.0.0",
  "description": "ChainMeet Attendance Tracking",
  "license": "MIT",
  "dependencies": {}
}
EOF

echo "✅ Directory structure created!"
echo ""
echo "📝 Next steps:"
echo "1. Copy meeting.leo content to ${MEETING_NAME}/src/main.leo (change program name to ${MEETING_NAME}.aleo)"
echo "2. Copy eligibility.leo content to ${ELIGIBILITY_NAME}/src/main.leo (change program name to ${ELIGIBILITY_NAME}.aleo)"
echo "3. Copy attendance.leo content to ${ATTENDANCE_NAME}/src/main.leo (change program name to ${ATTENDANCE_NAME}.aleo)"
echo "4. Run: cd ${MEETING_NAME} && leo build"
echo "5. Run: cd ../${ELIGIBILITY_NAME} && leo build"
echo "6. Run: cd ../${ATTENDANCE_NAME} && leo build"
echo ""
echo "Saved names to deploy_info.txt"
echo "MEETING=${MEETING_NAME}" > deploy_info.txt
echo "ELIGIBILITY=${ELIGIBILITY_NAME}" >> deploy_info.txt
echo "ATTENDANCE=${ATTENDANCE_NAME}" >> deploy_info.txt
